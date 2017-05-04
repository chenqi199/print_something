package com.bshinfo.cl.util.qiniu;

import com.bshinfo.cl.util.formater.Config;
import com.bshinfo.el.extra.qiniu.util.Auth;

public class AuthUtil extends Config {
	
	/**
	 * 下载签名m3u8
	 * @param url  视频地址
	 * @param time 有效时间（单位s） 
	 * @return
	 */
	public static String getM3u8ToknUrl(String url,long time){
		Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
		return auth.privateM3u8Url(url, time);
	}
	/**
	 * 下载签名m3u8 默认时间 （8s）
	 * @param url 下载地址
	 * @return
	 */
	public static String getM3u8ToknUrl(String url){
		Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
		return auth.privateM3u8Url(url, 8);
	}
	
	/**
	 * 下载签名
	 * @param url  视频地址
	 * @param time 有效时间（单位s） 
	 * @return
	 */
	public static String getDownloadToknUrl(String url,long time){
		Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
		return auth.privateDownloadUrl(url, time);
	}
	/**
	 * 下载签名 默认时间 （8s）
	 * @param url 下载地址
	 * @return
	 */
	public static String getDownloadToknUrl(String url){
		Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
		return auth.privateDownloadUrl(url, 8);
	}
	
	public static void main(String [] args){
		//System.out.println(AuthUtil.getDownloadToknUrl("http://zjqtest.365yunxueyuan.com/output.m3u8"));
		//System.out.println(UUIDTool.randomUUID());
		//System.out.println("");
	}
}
