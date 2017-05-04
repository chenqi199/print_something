package com.bshinfo.cl.util.logging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.jms.Destination;


/** 
 * 日志记录业务逻辑接口实现类 
 * @author HotStrong 
 */  
@Service("noticeQueueService")
public class NoticeQueueService{  
      
	@Autowired  
    private MQNoticeQueueProducer noticeQueueProducerService;
	
    @Autowired  
    @Qualifier("noticeQueue")
    private Destination noticeQueueDest;  
    
	public NoticeQueueService() {
	}
      
//    public void insertNoticeMessage(NoticeQueue nq) {
//    	noticeQueueProducerService.sendMessage(noticeQueueDest, nq);
//    }
    
} 