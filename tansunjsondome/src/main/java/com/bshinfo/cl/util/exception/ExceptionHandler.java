package com.bshinfo.cl.util.exception;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bshinfo.cl.util.formater.DateFormater;
import com.bshinfo.cl.util.logging.LogService;
import com.bshinfo.cl.util.net.ServerIPAddress;
import com.bshinfo.cl.model.Log;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

public class ExceptionHandler implements HandlerExceptionResolver {  
	private  Logger log = Logger.getLogger(ExceptionHandler.class);
	
	@Autowired
    private LogService logService;//日志记录Service
	
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, 
        Object handler, Exception ex) {  
        Map<String, Object> model = new HashMap<String, Object>();  
        String exceptionStr="E";
        // 在这里判断异常，根据不同的异常返回错误。

		if (ex.getClass().equals(ArithmeticException.class))  
        {  
        	log.debug("================数学运算异常！================");
        	exceptionStr+="0105";
        }
        else if (ex.getClass().equals(ArrayIndexOutOfBoundsException.class))  
        {  
        	log.debug("================数组下标越界!================");
        	exceptionStr+="0115";
        }
		else if (ex.getClass().equals(ClassCastException.class))  
        {  
        	log.debug("================类型强制转换错误！================");
        	exceptionStr+="0303";
        }
        else if (ex.getClass().equals(ClassNotFoundException.class))  
        {  
        	log.debug("================指定的类不存在！================");
        	exceptionStr+="0314";
        }
        else if (ex.getClass().equals(DataAccessException.class))  
        {  
        	log.debug("================数据库操作失败！================");
        	exceptionStr+="0401";
        }
        else if (ex.getClass().equals(IllegalArgumentException.class))  
        {  
        	log.debug("================方法的参数错误！================");
        	exceptionStr+="0901";
        }
		else if (ex.getClass().equals(InternalError.class))  
        {  
        	log.debug("================Java虚拟机发生了内部错误================");
        	exceptionStr+="0905";
        } 
        else if (ex.getClass().equals(IOException.class))  
        {  
        	log.debug("================IO异常！================");
        	exceptionStr+="0915";
        }
        else if (ex.getClass().equals(NoSuchMethodError.class))  
        {  
        	log.debug("================方法末找到异常！================");
        	exceptionStr+="1413";
        }
        else if (ex.getClass().toString().equals(NullPointerException.class.toString()))  
        {  
        	log.debug("================调用了未经初始化的对象或者是不存在的对象！================");
        	exceptionStr+="1416";
        }
        else if (ex.getClass().equals(SecurityException.class))  
        {  
        	log.debug("================违背安全原则异常！================");
        	exceptionStr+="1905";
        }
        else if (ex.getClass().equals(SQLException.class))  
        {  
        	log.debug("================操作数据库异常！================");
        	
        	exceptionStr+="1917";
        }
        else if (ex.getClass().equals(ServletException.class))  
        {  	
        	log.debug("================类访问异常！================");
        	exceptionStr+="1605";
        }
        else  
        {
        	log.debug("================程序内部错误，操作失败！================");
        	exceptionStr+="0000";
        }
exceptionStr+="."+ DateFormater.getExceptionCompactDateTimeString();
        
        Log exceptionlog = new Log();
        exceptionlog.setUserid(logService.loginUserId());//设置管理员id  
        exceptionlog.setCreatedate(new Date());//操作时间  
        exceptionlog.setContent( getContent(ex));//操作内容
        exceptionlog.setOperation("exception");//操作 
        exceptionlog.setExcepitonSequence(exceptionStr);
        exceptionlog.setIp(ServerIPAddress.getHostIp(ServerIPAddress.getInetAddress()));
        logService.insertExceptionlog(exceptionlog);//添加日志
        
        model.put("exceptionStr", exceptionStr);
        return new ModelAndView("error", model);
    }
    
    /**
     * 获取指定错误信息
     * @param ex
     * @return
     */
    private String getContent(Exception ex){
    	String content ="";
    	StringWriter sw = new StringWriter();
        ex.printStackTrace(new PrintWriter(sw, true));
        String [] strs = sw.toString().split("\r\n");
        if(strs.length>5){
        	String str = "";
        	int con = 0;
        	String error ="";
        	for(int i=0;i<strs.length;i++){
            	 if(i==0){
            		 str += strs[i] +"\r\n";
            	 }else if(i<=5){
            		 if(strs[i].indexOf("com.bshinfo")!=-1){
            			 con++;
            			 str += strs[i] +"\r\n";
            		 }else{
            			 error += strs[i] +"\r\n";
            		 }
            	 }else{
            		 if(strs[i].indexOf("com.bshinfo")!=-1){
            			 con++;
            			 str += strs[i] +"\r\n";
            		 }
            	 }
            }
        	if(con>0){
        		content = str;
        	}else{
        		content = error;
        	}
        }else{
        	 content = sw.toString();
        }
        if(content.length()>980){
        	content = content.substring(0, 980);
        }
    	return content;
    }

}
