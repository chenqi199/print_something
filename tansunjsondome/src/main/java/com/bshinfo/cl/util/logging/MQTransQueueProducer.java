package com.bshinfo.cl.util.logging;

import org.apache.log4j.Logger;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;



@Component
public class MQTransQueueProducer {
    
	private  Logger logger = Logger.getLogger(MQTransQueueProducer.class);
	private JmsTemplate jmsTemplate;  
    
//    public void sendMessage(Destination destination, final TransQueue tq) {
//    	logger.info("---------------生产者发了一个资源转化消息队列：");
//        try {
//			jmsTemplate.send(destination, new MessageCreator() {
//			    public Message createMessage(Session session) throws JMSException {
//			        return session.createObjectMessage(tq);
//			    }
//			});
//		} catch (JmsException e) {
//			//e.printStackTrace();
//		}
//    }
  
    public JmsTemplate getJmsTemplate() {  
        return jmsTemplate;  
    }   
  
    @Resource  
    public void setJmsTemplate(JmsTemplate jmsTemplate) {  
        this.jmsTemplate = jmsTemplate;  
    }   
}