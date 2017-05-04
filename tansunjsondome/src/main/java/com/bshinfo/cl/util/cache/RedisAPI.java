package com.bshinfo.cl.util.cache;

import java.io.IOException;
import java.util.Properties;
import java.util.Set;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.Protocol;

public class RedisAPI {
	private static JedisPool pool = null;

	/**
	 * 构建redis连接池
	 * 
	 * @param ip
	 * @param port
	 * @return JedisPool
	 */
	public static synchronized JedisPool getPool() {
		try {
			Resource resource = new ClassPathResource("/config/redis.properties");
			Properties props = PropertiesLoaderUtils.loadProperties(resource);
			if (pool == null) {
				JedisPoolConfig config = new JedisPoolConfig();
				// 控制一个pool可分配多少个jedis实例，通过pool.getResource()来获取
				config.setMaxTotal(Integer.parseInt(props.getProperty("maxTotal").toString()));
				// 控制一个pool最多有多少个状态为idle(空闲的)的jedis实例。
				config.setMaxIdle(Integer.parseInt(props.getProperty("maxIdle").toString()));
				// 表示当borrow(引入)一个jedis实例时，最大的等待时间，如果超过等待时间，则直接抛出JedisConnectionException；
				config.setMaxWaitMillis(Long.parseLong(props.getProperty("maxWaitMillis").toString()) * 1000);
				// 在borrow一个jedis实例时，是否提前进行validate操作；如果为true，则得到的jedis实例均是可用的；
				config.setTestOnBorrow(Boolean.getBoolean(props.getProperty("testOnBorrow").toString()));
				int rediPort = Integer.parseInt(props.getProperty("redisPort").toString());
				// pool = new JedisPool(config, props.getProperty("redisAddrees").toString(), rediPort, Protocol.DEFAULT_TIMEOUT, props.getProperty("redisPassword").toString());
				pool = new JedisPool(config, props.getProperty("redisAddrees").toString(), rediPort, Protocol.DEFAULT_TIMEOUT);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return pool;
	}

	/**
	 * 在多线程环境同步初始化
	 */
	private static synchronized void poolInit() {
		if (pool == null)
			getPool();
	}

	/**
	 * 返还到连接池
	 * 
	 * @param pool
	 * @param redis
	 */
	public static void returnResource(JedisPool pool, Jedis redis) {
		if (redis != null) {
			pool.returnResource(redis);
		}
	}

	/**
	 * 获取数据
	 * 
	 * @param key
	 * @return
	 */
	public static String get(String key) {
		String value = null;

		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			value = jedis.get(key);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}

		return value;
	}

	/**
	 * 获取数据
	 * 
	 * @param key
	 * @return
	 */
	public static void set(String key, String value) {
		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			jedis.set(key, value);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}
	}

	/**
	 * 获取数据
	 * 
	 * @param key
	 * @return
	 */
	public static Set<String> hexist(String hasKey) {
		Set<String> value = null;
		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			value = jedis.hkeys(hasKey);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}

		return value;
	}

	/**
	 * 获取数据
	 * 
	 * @param key
	 * @return
	 */
	public static String hget(String hasKey, String fieldKey) {
		String value = null;

		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			value = jedis.hget(hasKey, fieldKey);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}

		return value;
	}

	/**
	 * 获取数据
	 * 
	 * @param key
	 * @return
	 */
	public static void hset(String hasKey, String fieldKey, String value) {
		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			jedis.hset(hasKey, fieldKey, value);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}
	}

	/**
	 * 
	 * 删除hashKey删除hash集合
	 * 
	 * @param hasKey
	 * @return
	 */
	public static void hdel(String hasKey) {
		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			jedis.del(hasKey);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}
	}
	
	/**
	 * 删除集合中的某条数据
	 * @param hasKey
	 * @param fieldKey
	 * @return
	 */
	public static void hdel(String hasKey, String fieldKey) {
		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			jedis.hdel(hasKey, fieldKey);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}
	}
	
	/**
	 * 设置失效时间
	 * @param key
	 * @param expiration 失效时间（秒）
	 */
	public static void expire(String key,int expiration) {
		JedisPool pool = null;
		Jedis jedis = null;
		try {
			pool = getPool();
			jedis = pool.getResource();
			jedis.expire(key, expiration);
		} catch (Exception e) {
			// 释放redis对象
			if(pool!=null && jedis!=null){
				pool.returnBrokenResource(jedis);
			}
			e.printStackTrace();
		} finally {
			// 返还到连接池
			returnResource(pool, jedis);
		}
	}	

}
