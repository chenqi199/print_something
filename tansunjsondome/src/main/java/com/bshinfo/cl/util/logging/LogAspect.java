package com.bshinfo.cl.util.logging;

import java.lang.reflect.Method;
import java.util.Date;

import com.bshinfo.cl.util.net.ServerIPAddress;
import com.bshinfo.cl.model.Log;
import org.aspectj.lang.JoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;


public class LogAspect implements BeanPostProcessor {
	
    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);  
      
	@Autowired
    private LogService logService;//日志记录Service
	
    /** 
     * 管理员添加操作日志(后置通知)、select、insert、update、delete
     * @param point 
     * @throws Throwable 
     */  
    public void insertLog(JoinPoint point) throws Throwable{ 
        if(point.getArgs() == null){//没有参数  
            return;  
        }
        String methodName = point.getSignature().getName(); //获取方法名 
        //获取操作内容  
        String opContent = adminOptionContent(point.getArgs(), methodName);  
        //创建日志对象  
        Log dblog = new Log();
        dblog.setUserid(logService.loginUserId());//设置管理员id  
        dblog.setCreatedate(new Date());//操作时间  
        dblog.setContent(opContent);//操作内容
        if(methodName.indexOf("select") == 0 || methodName.indexOf("get") == 0 || methodName.indexOf("find") == 0){
        	dblog.setOperation("查询");//操作 
        }else if(methodName.indexOf("insert") == 0){
        	dblog.setOperation("增加");//操作
        }else if(methodName.indexOf("update") == 0){
        	dblog.setOperation("修改");//操作
        }else if(methodName.indexOf("delete") == 0){
        	dblog.setOperation("删除");//操作
        }
        dblog.setIp(ServerIPAddress.getHostIp(ServerIPAddress.getInetAddress()));
        logService.insertDaolog(dblog);//添加日志 
        log.debug("正在产生消息："+dblog.getUserid()+" "+dblog.getOperation()+" "+dblog.getContent()+" "+dblog.getCreatedate());
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
              
            //获取对象类型  
            className = info.getClass().getName();  
            className = className.substring(className.lastIndexOf(".") + 1);  
            rs.append("[参数" + index + "，类型：" + className + "，值：");  
              
            if(className.equals("")){
            	rs.append(info);
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
        }  
          
        return rs.toString();  
    }

	public Object postProcessAfterInitialization(Object arg0, String arg1)
			throws BeansException {
		return null;
	}

	public Object postProcessBeforeInitialization(Object arg0, String arg1)
			throws BeansException {
		return null;
	}
  
}  