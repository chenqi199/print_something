package com.bshinfo.cl.util.formater;

import java.util.Random;
/**
 * 获取默认图片
 * @author zjq
 *
 */
public class GetDefaultPicture {
	  private final static int max=22;
	  private final static int min=1;
	
	public static String getImage(){
		String result ="1.jpg";
		Random random = new Random();
		result  = random.nextInt(max)%(max-min+1) + min +".jpg";
		return result;
	}
	
}
