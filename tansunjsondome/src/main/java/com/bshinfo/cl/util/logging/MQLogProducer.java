package com.bshinfo.cl.util.logging;

import javax.annotation.Resource;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import com.bshinfo.cl.model.Log;
import org.apache.log4j.Logger;
import org.springframework.jms.JmsException;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Component;


@Component
public class MQLogProducer {
    
	private  Logger logger = Logger.getLogger(MQLogProducer.class);
	private JmsTemplate jmsTemplate;  
    
    public void sendMessage(Destination destination, final Log log) {
    	logger.info("---------------生产者发了一个日志消息：" + log.getOperation());
        try {
			jmsTemplate.send(destination, new MessageCreator() {
			    public Message createMessage(Session session) throws JMSException {
			        return session.createObjectMessage(log);  
			    }  
			});
		} catch (JmsException e) {
			//e.printStackTrace();
		}  
    }   
  
    public JmsTemplate getJmsTemplate() {  
        return jmsTemplate;  
    }   
  
    @Resource  
    public void setJmsTemplate(JmsTemplate jmsTemplate) {  
        this.jmsTemplate = jmsTemplate;  
    }   
}