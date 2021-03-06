package com.bshinfo.cl.util.db;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.bshinfo.cl.model.Log;
import com.bshinfo.cl.util.formater.JSONFormater;
import com.bshinfo.cl.util.logging.LogService;
import com.bshinfo.cl.util.net.ServerIPAddress;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.NestedRuntimeException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.interceptor.NameMatchTransactionAttributeSource;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;
import org.springframework.transaction.interceptor.TransactionAttribute;
import org.springframework.util.PatternMatchUtils;
import org.springframework.util.ReflectionUtils;

/** 
 *  
 *  
 * <pre> 
 *  
 * 此类实现了两个职责（为了减少类的数量将两个功能合并到一起了）： 
 *   读/写动态数据库选择处理器 
 *   通过AOP切面实现读/写选择 
 *    
 *    
 * ★★读/写动态数据库选择处理器★★ 
 * 1、首先读取<tx:advice>事务属性配置 
 *  
 * 2、对于所有读方法设置 read-only="true" 表示读取操作（以此来判断是选择读还是写库），其他操作都是走写库 
 *    如<tx:method name="×××" read-only="true"/> 
 *     
 * 3、 forceChoiceReadOnWrite用于确定在如果目前是写（即开启了事务），下一步如果是读， 
 *    是直接参与到写库进行读，还是强制从读库读<br/> 
 *      forceChoiceReadOnWrite:true 表示目前是写，下一步如果是读，强制参与到写事务（即从写库读） 
 *                                  这样可以避免写的时候从读库读不到数据 
 *                                   
 *                                  通过设置事务传播行为：SUPPORTS实现 
 *                                   
 *      forceChoiceReadOnWrite:false 表示不管当前事务是写/读，都强制从读库获取数据 
 *                                  通过设置事务传播行为：NOT_SUPPORTS实现（连接是尽快释放）                 
 *                                  『此处借助了 NOT_SUPPORTS会挂起之前的事务进行操作 然后再恢复之前事务完成的』 
 * 4、配置方式 
 *  <bean id="readWriteDataSourceTransactionProcessor" class="cn.javass.common.datasource.ReadWriteDataSourceProcessor"> 
 *      <property name="forceChoiceReadWhenWrite" value="false"/> 
 *  </bean> 
 * 
 * 5、目前只适用于<tx:advice>情况 TODO 支持@Transactional注解事务 
 *   
 *   
 *   
 * ★★通过AOP切面实现读/写库选择★★ 
 *  
 * 1、首先将当前方法 与 根据之前【读/写动态数据库选择处理器】  提取的读库方法 进行匹配 
 *  
 * 2、如果匹配，说明是读取数据： 
 *  2.1、如果forceChoiceReadOnWrite:true，即强制走读库 
 *  2.2、如果之前是写操作且forceChoiceReadOnWrite:false，将从写库进行读取 
 *  2.3、否则，到读库进行读取数据 
 *  
 * 3、如果不匹配，说明默认将使用写库进行操作 
 *  
 * 4、配置方式 
 *      <aop:aspect order="-2147483648" ref="readWriteDataSourceTransactionProcessor"> 
 *          <aop:around pointcut-ref="txPointcut" method="determineReadOrWriteDB"/> 
 *      </aop:aspect> 
 *  4.1、此处order = Integer.MIN_VALUE 即最高的优先级（请参考http://jinnianshilongnian.iteye.com/blog/1423489） 
 *  4.2、切入点：txPointcut 和 实施事务的切入点一样 
 *  4.3、determineReadOrWriteDB方法用于决策是走读/写库的，请参考 
 *       @see cn.javass.common.datasource.ReadWriteDataSourceDecision 
 *       @see cn.javass.common.datasource.ReadWriteDataSource 
 *  
 * </pre> 
 * @author Zhang Kaitao 
 * 
 */ 
public class ReadWriteDataSourceProcessor implements BeanPostProcessor {
	
//    private static final Logger log = LoggerFactory.getLogger(ReadWriteDataSourceProcessor.class);  
      
    private boolean forceChoiceReadWhenWrite = false;  
      
    private Map<String, Boolean> readMethodMap = new HashMap<String, Boolean>();  
  
    /** 
     * 当之前操作是写的时候，是否强制从从库读 
     * 默认（false） 当之前操作是写，默认强制从写库读 
     * @param forceReadOnWrite 
     */ 
      
    public void setForceChoiceReadWhenWrite(boolean forceChoiceReadWhenWrite) {  
          
        this.forceChoiceReadWhenWrite = forceChoiceReadWhenWrite;  
    }  
      
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {  
  
        if(!(bean instanceof NameMatchTransactionAttributeSource)) {  
            return bean;  
        }
          
        try {  
            NameMatchTransactionAttributeSource transactionAttributeSource = (NameMatchTransactionAttributeSource)bean;  
            Field nameMapField = ReflectionUtils.findField(NameMatchTransactionAttributeSource.class, "nameMap");  
            nameMapField.setAccessible(true);  
            Map<String, TransactionAttribute> nameMap = (Map<String, TransactionAttribute>) nameMapField.get(transactionAttributeSource);  
              
            for(Entry<String, TransactionAttribute> entry : nameMap.entrySet()) {  
                RuleBasedTransactionAttribute attr = (RuleBasedTransactionAttribute)entry.getValue();  
  
                //仅对read-only的处理 
                if(!attr.isReadOnly()) {  
                    continue;  
                }  
                  
                String methodName = entry.getKey();  
                Boolean isForceChoiceRead = Boolean.FALSE;  
                if(forceChoiceReadWhenWrite) {  
                	//不管之前操作是写，默认强制从读库读 （设置为NOT_SUPPORTED即可）  
                    //NOT_SUPPORTED会挂起之前的事务   
                    attr.setPropagationBehavior(Propagation.NOT_SUPPORTED.value());  
                    isForceChoiceRead = Boolean.TRUE;  
                } else {  
                	//否则 设置为SUPPORTS（这样可以参与到写事务）  
                    attr.setPropagationBehavior(Propagation.SUPPORTS.value());  
                }  
//                log.debug("read/write transaction process  method:{} force read:{}", methodName, isForceChoiceRead);  
                readMethodMap.put(methodName, isForceChoiceRead);  
            }  
              
        } catch (Exception e) {  
            throw new ReadWriteDataSourceTransactionException("process read/write transaction error", e);  
        }  
          
        return bean;  
    }  
      
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {  
        return bean;  
    }  
  
    private class ReadWriteDataSourceTransactionException extends NestedRuntimeException {  
        public ReadWriteDataSourceTransactionException(String message, Throwable cause) {  
            super(message, cause);  
        }  
    }  
      
    public Object determineReadOrWriteDB(ProceedingJoinPoint pjp) throws Throwable {  
    	String methodName = pjp.getSignature().getName();
    	if(methodName.indexOf("get") != 0 && methodName.indexOf("select") != 0 && methodName.indexOf("find") != 0 && methodName.indexOf("insert") != 0 && methodName.indexOf("update") != 0 && methodName.indexOf("delete") != 0 
    			&& methodName.indexOf("selectByPrimaryKey") != 0){
    		throw new Throwable("警告：Dao层禁止使用除了以'get'、'select'、'find'、'insert'、'update'、'delete'为开头及selectByPrimaryKey以外的的方法名，并且方法名大小写敏感！");
    	}
    	
        if (isChoiceReadDB(pjp.getSignature().getName())) {  
            ReadWriteDataSourceDecision.markRead();  
        } else {  
            ReadWriteDataSourceDecision.markWrite();  
        }
              
        try {  
            return pjp.proceed();  
        } finally {  
            ReadWriteDataSourceDecision.reset();  
        }
        
    }  
    
	private boolean isChoiceReadDB(String methodName) {  
  
        String bestNameMatch = null;  
        for (String mappedName : this.readMethodMap.keySet()) {  
            if (isMatch(methodName, mappedName)) {  
                bestNameMatch = mappedName;  
                break;  
            }  
        }  
  
        Boolean isForceChoiceRead = readMethodMap.get(bestNameMatch);  
        //表示强制选择 读 库 
        if(isForceChoiceRead == Boolean.TRUE) {  
            return true;  
        }  
          
        //如果之前选择了写库 现在还选择 写库
        if(ReadWriteDataSourceDecision.isChoiceWrite()) {  
            return false;  
        }  
          
        //表示应该选择读库  
        if(isForceChoiceRead != null) {  
            return true;  
        }  
        //默认选择 写库
        return false;  
    }  
  
  
    protected boolean isMatch(String methodName, String mappedName) {  
        return PatternMatchUtils.simpleMatch(mappedName, methodName);  
    }  
    
    @Autowired
    private LogService logService;//日志记录Service
	
    /** 
     * 管理员添加操作日志(后置通知)、select、insert、update、delete
     * @param point 
     * @throws Throwable 
     */  
     boolean writeLog = true ; 
	 public void insertLog(JoinPoint point) throws Throwable{ 
	        if(point.getArgs() == null){ //没有参数  
	            return;  
	        }
	        String methodName = point.getSignature().getName(); //获取方法名 
	        //获取操作内容  
	        String opContent = point.toShortString()+"，"+adminOptionContent(point.getArgs(), methodName);  
	        //创建日志对象  
	        Log dblog = new Log();
	        dblog.setUserid(logService.loginUserId()); //设置管理员id  
	        dblog.setCreatedate(new Date());//操作时间  
	        dblog.setContent(opContent);//操作内容
	        if(methodName.indexOf("select") == 0 || methodName.indexOf("get") == 0 || methodName.indexOf("find") == 0){
	        	writeLog = false;
	        	dblog.setOperation("查询");//操作 
	        }else if(methodName.indexOf("insert") == 0){
	        	writeLog = false;
	        	dblog.setOperation("增加");//操作
	        }else if(methodName.indexOf("update") == 0){
	        	writeLog = false;
	        	dblog.setOperation("修改");//操作
	        }else if(methodName.indexOf("delete") == 0){
	        	writeLog = false;
	        	dblog.setOperation("删除");//操作
	        }
	        dblog.setIp(ServerIPAddress.getHostIp(ServerIPAddress.getInetAddress()));
	        if(writeLog){
	        	logService.insertDaolog(dblog);//添加日志 
//		        log.debug("正在产生消息："+dblog.getUserid()+" "+dblog.getOperation()+" "+dblog.getContent()+" "+dblog.getCreatedate());
	        }
	        
	    }  
    
    /** 
     * 使用Java反射来获取被拦截方法(insert、update、delete)的参数值， 
     * 将参数值拼接为操作内容 
     */  
    public String adminOptionContent(Object[] args, String mName) throws Exception{  
        if (args == null) {  
            return null;  
        }  
          
        StringBuffer rs = new StringBuffer();  
        rs.append(mName);  
        String className = null;  
        int index = 1;  
        // 遍历参数对象  
        for (Object info : args) {  
            try {
				//获取对象类型  
				className = info.getClass().getName();  
				//className = className.substring(className.lastIndexOf(".") + 1);  
				rs.append("[参数" + index + "，类型：" + className + "，值：");  
				  
				if(className.equals("")){
					rs.append(info);
				}else if(className.equals(String.class.getName())){
					rs.append(info.toString());
				}else if(className.equals(Integer.class.getName())){
					rs.append(((Integer)info).intValue());
				}else if(className.equals(Long.class.getName())){
					rs.append(((Long)info).longValue());
				}else if(className.equals(Float.class.getName())){
					rs.append(((Float)info).floatValue());
				}else if(className.equals(Double.class.getName())){
					rs.append(((Double)info).doubleValue());
				}else if(className.equals(Date.class.getName())){
					rs.append(((Date)info).getTime());
				}else if(className.equals(Boolean.class.getName())){
					rs.append(((Boolean)info).booleanValue());
				}else if(className.equals(List.class.getName())){
					rs.append(JSONFormater.getJSONArrayString2((List)info));
				}else if(className.equals(Map.class.getName())){
					rs.append(JSONFormater.getJSONString((Map)info));
				}else{
				    // 获取对象的所有方法  
				    Method[] methods = info.getClass().getDeclaredMethods();  
				    // 遍历方法，判断get方法  
				    for (Method method : methods) {  
				        String methodName = method.getName();  
				        // 判断是不是get方法  
				        if (methodName.indexOf("get") == -1) {// 不是get方法  
				            continue;// 不处理  
				        }  
				        Object rsValue = null;  
				        try {  
				        	Class z = method.getReturnType();
				        	if(z.toString().equals("void")){// 无返回值方法 
				        		continue;
				        	}
				            if(z.equals(Byte.class)){
				            	z=String.class;
				            }
				            // 调用get方法，获取返回值  
				            rsValue = method.invoke(info, z);  
				            if (rsValue == null) {//没有返回值  
				                continue;  
				            }  
				        } catch (Exception e) {  
				            continue;  
				        }  
				        //将值加入内容中  
				        rs.append("(" + methodName + " : " + rsValue + ")");  
				    }  
				}
				rs.append("]");  
				index++;
			} catch (Exception e) {
				//e.printStackTrace();
			}  
        }  
          
        return rs.toString();  
    }
    
    public static final void main(String[] args){
    	System.out.println(String.class);
    }
  
}  