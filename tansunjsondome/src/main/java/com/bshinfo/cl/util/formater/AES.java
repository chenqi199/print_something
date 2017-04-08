/**
 * aes+base64加密
 * 用于获取视频访问地址
 */
package com.bshinfo.cl.util.formater;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class AES {

	private static String encryptAES(String content, String key)
			throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, UnsupportedEncodingException,
			InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
		byte[] byteContent = content.getBytes("UTF-8");
		// 注意，为了能与 iOS 统一
		// 这里的 key 不可以使用 KeyGenerator、SecureRandom、SecretKey 生成
		byte[] enCodeFormat = key.getBytes("UTF-8");
		SecretKeySpec secretKeySpec = new SecretKeySpec(enCodeFormat, "AES");
		byte[] initParam = Config.IV_STRING.getBytes("UTF-8");
		IvParameterSpec ivParameterSpec = new IvParameterSpec(initParam);
		// 指定加密的算法、工作模式和填充方式
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
		byte[] encryptedBytes = cipher.doFinal(byteContent);
		// 同样对加密后数据进行 base64 编码
		Base64.Encoder encoder = Base64.getEncoder();
		return encoder.encodeToString(encryptedBytes);
	}

	private static String decryptAES(String content, String key) throws InvalidKeyException, NoSuchAlgorithmException,
			NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException,
			UnsupportedEncodingException {
		// base64 解码
		Base64.Decoder decoder = Base64.getDecoder();
		byte[] encryptedBytes = decoder.decode(content);
		byte[] enCodeFormat = key.getBytes("UTF-8");
		SecretKeySpec secretKey = new SecretKeySpec(enCodeFormat, "AES");
		byte[] initParam = Config.IV_STRING.getBytes("UTF-8");
		IvParameterSpec ivParameterSpec = new IvParameterSpec(initParam);
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, secretKey, ivParameterSpec);
		byte[] result = cipher.doFinal(encryptedBytes);
		return new String(result, "UTF-8");
	}
	
	public static String encryptAES(String content) throws InvalidKeyException, NoSuchAlgorithmException,
	NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException,
	UnsupportedEncodingException {
		return encryptAES(content,Config.KEY);
	}
	
	public static String decryptAES(String content) throws InvalidKeyException, NoSuchAlgorithmException,
	NoSuchPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException,
	UnsupportedEncodingException {
		return decryptAES(content,Config.KEY);
	}
	
	
	public static void main(String [] args){
		try {
			String str = encryptAES("816ec995fb4140369034b2fa0eeca6fe"+"_eeca6fe_eeooca6fe", Config.KEY);
			//System.out.println(str);
			//System.out.println(decryptAES(URLDecoder.decode(str, "UTF-8"), Config.KEY));
			//System.out.println(UUIDTool.randomUUID().toUpperCase());
			long time = 1451491200000L;
			//System.out.println(new java.sql.Date(time));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

}