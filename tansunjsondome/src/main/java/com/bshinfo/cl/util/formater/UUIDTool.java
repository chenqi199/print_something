package com.bshinfo.cl.util.formater;

import java.util.UUID;

public class UUIDTool {
	
	public static String randomUUID(){
		String uuid = UUID.randomUUID().toString();
		uuid = uuid.replaceAll("-", "");
		return uuid;
	}
	
	public static void main(String [] args){
		for(int i=0;i<50;i++){
			//System.out.println(randomUUID());
		}
	}
}
