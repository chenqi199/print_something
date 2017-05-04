package com.bshinfo.cl.util.formater;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 替换截取字符串类
 * 
 * @author 张佳庆
 * 
 */
public class RegUtil
{
	public static String cutQContent(List<String> list,String str){
		String result = str;
		String regex = "&lt;QContent&gt;.*?&lt;/QContent&gt;";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(str);
		if (matcher.find()) {
			String group = matcher.group(matcher.groupCount());
			list.add(group);
			result = result.substring(0, result.indexOf(group)) + "&lt;Content&gt;&lt;/Content&gt;" + result.substring(result.indexOf(group)+group.length());
			result = cutQContent(list,result);
		}else {
			//System.out.println("no matches!!");
		}
		return result;
	}
	
	public static String cutData(String str){
		String result = str;
		String regex = "![CDATA[";
		if(str.indexOf(regex)>-1){
			result = str.substring(result.indexOf(regex)+regex.length(), result.lastIndexOf("]]"));
		}
		return result;
	}

	public static void main(String[] args)
	{
		List<String> list = new ArrayList<String>();
		String q = "<root><row><ExamICode>315552</ExamICode><qNo>274114</qNo><qNoTxt></qNoTxt><topic><![CDATA[对于有效期满，合计标准保费未达到当前级别标准的VIP客户，应当如何处理？（）<br><br><br><br>;]]></topic><QContent><row><value>1</value><content><![CDATA[立即做降级处理]]></content></row><row><value>2</value><content><![CDATA[维持期保留VIP客户级别]]></content></row><row><value>3</value><content><![CDATA[取消VIP客户级别资格]]></content></row><row><value>4</value><content><![CDATA[冻结VIP客户级别]]></content></row></QContent><answer><![CDATA[2;]]></answer><EqType><![CDATA[DANX]]></EqType><FullScore>50.0</FullScore></row><row><ExamICode>315552</ExamICode><qNo>274118</qNo><qNoTxt></qNoTxt><topic><![CDATA[对于有效期满，合计标准保费达到当前级别标准的VIP客户，应当如何处理？（）<br>;]]></topic><QContent><row><value>1</value><content><![CDATA[顺延原VIP级别]]></content></row><row><value>2</value><content><![CDATA[级别晋升处理]]></content></row><row><value>3</value><content><![CDATA[降级处理]]></content></row><row><value>4</value><content><![CDATA[以上都不是]]></content></row></QContent><answer><![CDATA[1;]]></answer><EqType><![CDATA[DANX]]></EqType><FullScore>50.0</FullScore></row></root>";
		cutQContent(list,q);
		for(int i=0;i<list.size();i++){
			//System.out.println(list.get(i));
		}
	}

}
