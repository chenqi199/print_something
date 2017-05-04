package com.bshinfo.cl.util.logging;

import com.bshinfo.cl.model.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.jms.Destination;
//import com.bshinfo.cl.util.security.SXYSessionUtils;


/** 
 * 日志记录业务逻辑接口实现类 
 * @author HotStrong 
 */  
@Service("logService")
public class LogService{  
      
	@Autowired  
    private MQLogProducer producerService;
	
    @Autowired  
    @Qualifier("exceptionLogQueueDest")
    private Destination exceptionLogQueueDest;  
    
    @Autowired  
    @Qualifier("daoLogQueueDest")
    private Destination daoLogQueueDest; 
    
    //private  Logger logger = Logger.getLogger(LogService.class);
    
	public LogService() {
	}
	
    public void insertExceptionlog(Log log) {
    	producerService.sendMessage(exceptionLogQueueDest, log);  
    } 
      
    public void insertDaolog(Log log) {
    	producerService.sendMessage(daoLogQueueDest, log);  
    }  

    /** 
     * 获取登录管理员ID 
     * @return 
     */  
    public String loginUserId() {
//    	String userId = SXYSessionUtils.getUseridFromSession();
//    	 获取登录管理员帐号名
//        if(userId == null || userId.equals("")){
//        	return new String("9000");
//        }
//    	return userId;
    	return "1111";
    }
} 