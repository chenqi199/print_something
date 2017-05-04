package com.bshinfo.cl.util.logging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.jms.Destination;


/** 
 * 日志记录业务逻辑接口实现类 
 * @author HotStrong 
 */  
@Service("transQueueService")
public class TransQueueService{  
      
	@Autowired  
    private MQTransQueueProducer transQueueProducerService;
	
    @Autowired  
    @Qualifier("trainsQueue")
    private Destination transQueueDest;  
    
	public TransQueueService() {
	}
      
//    public void insertTransMessage(TransQueue tq) {
//    	transQueueProducerService.sendMessage(transQueueDest, tq);
//    }
    
} 