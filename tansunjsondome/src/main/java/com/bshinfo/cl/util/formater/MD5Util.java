package com.bshinfo.cl.util.formater;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.log4j.Logger;

public class MD5Util
{
	private static final Logger logger = Logger.getLogger(MD5Util.class);
	// 加密键
	private final static String strEncryptKey = "bshinfo";
	public final static String MD5(String s)
	{
		String Key= MD5Util.md5(strEncryptKey).toLowerCase();
		String password=MD5Util.md5(s).toLowerCase();
		return  md5(password+Key).toLowerCase();
		
	}
	public final static String MD5SALT(String s){
		char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
		try
		{
			byte[] btInput = s.getBytes("UTF-8");
			// 获得MD5摘要算法的 MessageDigest 对象
			MessageDigest mdInst = MessageDigest.getInstance("MD5");
			// 使用指定的字节更新摘要
			mdInst.update(btInput);
			// 获得密文
			byte[] md = mdInst.digest();
			// 把密文转换成十六进制的字符串形式
			int j = md.length;
			char str[] = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++)
			{
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			
			
			return new String(str).toLowerCase();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	public static void main(String[] args) throws NoSuchAlgorithmException
	{
//		logger.debug(MD51(MD51("password").toLowerCase()+MD51(strEncryptKey)));
		logger.debug(md5(md5("123456")+md5("bshinfo")));
		
	}
 
    public static String md5(String plainText) {
        if (null == plainText) {
          plainText = "";
        }
        String MD5Str = "";
        try {
          // JDK 6 支持以下6种消息摘要算法，不区分大小写
          // md5,sha(sha-1),md2,sha-256,sha-384,sha-512
          MessageDigest md = MessageDigest.getInstance("MD5");
          md.update(plainText.getBytes("UTF-8"));
          byte b[] = md.digest();
     
          int i;
     
          StringBuilder builder = new StringBuilder(32);
          for (int offset = 0; offset < b.length; offset++) {
            i = b[offset];
            if (i < 0)
              i += 256;
            if (i < 16)
              builder.append("0");
            builder.append(Integer.toHexString(i));
          }
          MD5Str = builder.toString();
          // LogUtil.println("result: " + buf.toString());// 32位的加密
        } catch (Exception e) {
          e.printStackTrace();
        }
        return MD5Str;
      }
     
}
