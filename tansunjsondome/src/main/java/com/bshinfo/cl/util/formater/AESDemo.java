package com.bshinfo.cl.util.formater;

import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
/** 
 *  
 * @author xiangxg 
 * aes 128加密器 
 * 
 */  
  
public class AESDemo {  
	private static String key = "YDuSFnJ0ubpN+d-vtyxcHBbv";
    /** 
     * 加密 
     *  
     * @param content 
     *            需要加密的内容 
     * @return 
     * @throws NoSuchPaddingException 
     * @throws Exception 
     */  
    public static String encrypt(String content) throws Exception{  
        if(content!=null){
	         Cipher cipher = Cipher.getInstance("AES");// 创建密码器  
	         byte[] byteContent = content.getBytes("utf-8"); 
	         System.out.println("ddd="+genKey(key).getFormat());
	         cipher.init(Cipher.ENCRYPT_MODE, genKey(key));// 初始化  
	         byte[] result = cipher.doFinal(byteContent);  
	         return parseByte2HexStr(result); // 加密  
        }  
        return null;  
  
    }  
    /** 
     * 解密 
     *  
     * @param content 
     *            待解密内容 
     * @return 
     */  
    public static String decrypt(String content) throws Exception{  
    	if(content!=null&&content.length()>0){
	        byte[] decryptFrom = parseHexStr2Byte(content);  
	        Cipher cipher = Cipher.getInstance("AES");// 创建密码器  
	        cipher.init(Cipher.DECRYPT_MODE, genKey(key));// 初始化  
	        byte[] result = cipher.doFinal(decryptFrom);
	        return new String(result, "UTF-8"); // 加密  
    	}
        return null;  
    }  
      
    /** 
     * 根据密钥获得 SecretKeySpec 
     * @return 
     */  
    private  static SecretKeySpec genKey(String key){  
   String strKey = key;// 加密解密密钥  
    byte[] enCodeFormat = {0}; ;  
    try {  
        KeyGenerator kgen = KeyGenerator.getInstance("AES");  
        SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");     
        secureRandom.setSeed(strKey.getBytes());     
        kgen.init(128, secureRandom);  
        SecretKey secretKey = kgen.generateKey();
        enCodeFormat = secretKey.getEncoded();
    } catch (Exception e) {  
        e.printStackTrace();  
    }  
      
    return new SecretKeySpec(enCodeFormat, "AES");  
}  

  

/** 
 * 将二进制转换成16进制 
 *  
 * @param buf 
 * @return 
 */  
private static String parseByte2HexStr(byte buf[]) {  
    StringBuffer sb = new StringBuffer();  
    for (int i = 0; i < buf.length; i++) {  
        String hex = Integer.toHexString(buf[i] & 0xFF);  
        if (hex.length() == 1) {  
            hex = '0' + hex;  
        }  
        sb.append(hex.toUpperCase());  
    }  
    return sb.toString();  
}  

/** 
 * 将16进制转换为二进制 
 *  
 * @param hexStr 
 * @return 
 */  
private static byte[] parseHexStr2Byte(String hexStr) {  
    if (hexStr.length() < 1)  
        return null;  
    byte[] result = new byte[hexStr.length() / 2];  
    for (int i = 0; i < hexStr.length() / 2; i++) {  
        int high = Integer.parseInt(hexStr.substring(i * 2, i * 2 + 1), 16);  
        int low = Integer.parseInt(hexStr.substring(i * 2 + 1, i * 2 + 2),  
                16);  
        result[i] = (byte) (high * 16 + low);  
    }  
    return result;  
}  
  

public static void main(String[] args) {  
      //加密
        try {
			System.out.println(AESDemo.encrypt("23010619920222043X")+"\n");
			System.out.println(AESDemo.encrypt("个险销售支持与训练岗（县）")+"\n");
			System.out.println(AESDemo.encrypt("经理（省）")+"\n");
		} catch (Exception e) {
			e.printStackTrace();
		}  
       //解密
        try {
			System.out.println(AESDemo.decrypt("EA887AED61852457EE90D3C05863B8FBA7D192D187D0075C8DAC94702E46388483A4A2419E886108BB68B88FBE61C4E0")+"\n");
		} catch (Exception e) {
			e.printStackTrace();
		}  
}  

}  

    	
