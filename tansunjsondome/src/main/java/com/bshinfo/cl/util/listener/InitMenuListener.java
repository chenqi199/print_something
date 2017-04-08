package com.bshinfo.cl.util.listener;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
/**
 * 数据初始化
 * @author zjq
 *
 */

public class InitMenuListener implements ApplicationListener<ContextRefreshedEvent>  {

	private Logger logger = Logger.getLogger(InitMenuListener.class);
//
//	@Autowired
//	private MenuServiceI menuService;
	
	@Override
	public void onApplicationEvent(ContextRefreshedEvent arg0) {
		logger.info("初始化角色权限到cache");
		//menuService.getRoleResourceCache();
		logger.info("初始化结束");
		
	}

	

}
