package com.bshinfo.cl.util.cache;

import java.util.Date;

import com.bshinfo.cl.util.formater.DateFormater;
import org.apache.log4j.Logger;

import com.opensymphony.oscache.base.NeedsRefreshException;
import com.opensymphony.oscache.general.GeneralCacheAdministrator;

/**
 * OSCache管理类
 */
public class OSCacheManage {

	private Logger logger = Logger.getLogger(OSCacheManage.class);

	private static OSCacheManage instance = null;

	private GeneralCacheAdministrator cacheAdministrator = null;

	private OSCacheManage() {
		cacheAdministrator = new GeneralCacheAdministrator();
		logger.info("在====" + DateFormater.toLongDateString(new Date()) + " 时创建=====GeneralCacheAdministrator=====实例");
	}

	public void setCacheAdministrator(GeneralCacheAdministrator cacheAdministrator) {
		this.cacheAdministrator = cacheAdministrator;
	}

	public static synchronized OSCacheManage getInstance() {

		if (instance == null) {
			instance = new OSCacheManage();
		}
		return instance;
	}

	public Object getFromCache(String key) {
		return getFromCache(key, -1);
	}

	public Object getFromCache(String key, int refreshPeriod) {
		Object obj = null;
		try {
			obj = cacheAdministrator.getFromCache(key, refreshPeriod);
		} catch (NeedsRefreshException e) {
			cancelUpdate(key);
		}
		return obj;
	}

	public void putInCache(String key, Object content) {
		cacheAdministrator.putInCache(key, content);
	}

	public void removeEntry(String key) {
		cacheAdministrator.removeEntry(key);
	}

	private void cancelUpdate(String key) {
		cacheAdministrator.cancelUpdate(key);
	}

	public void destroy() {
		if (cacheAdministrator != null) {
			cacheAdministrator.destroy();
		}
	}
}
