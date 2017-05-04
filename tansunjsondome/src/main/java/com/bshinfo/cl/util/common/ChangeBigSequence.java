package com.bshinfo.cl.util.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import freemarker.template.TemplateMethodModel;
import freemarker.template.TemplateModelException;

/**
 * freemarker工具类，将传入的大标题题序转换为大写的（例：1 --> 一）
 * 
 * @author 杨阳
 * 
 */
public class ChangeBigSequence implements TemplateMethodModel
{

	public Object exec(@SuppressWarnings("rawtypes") List l) throws TemplateModelException
	{
		String sequence = l.get(0).toString();
		Map<String, String> m = new HashMap<String, String>();
		m.put("1", "一");
		m.put("2", "二");
		m.put("3", "三");
		m.put("4", "四");
		m.put("5", "五");
		m.put("6", "六");
		m.put("7", "七");
		m.put("8", "八");
		m.put("9", "九");
		m.put("10", "十");
		m.put("11", "十一");
		m.put("12", "十二");
		m.put("13", "十三");
		m.put("14", "十四");
		m.put("15", "十五");
		m.put("16", "十六");
		m.put("17", "十七");
		m.put("18", "十八");
		m.put("19", "十九");
		m.put("20", "二十");
		String newValue = m.get(sequence);
		return newValue;
	}
	public static String parseException(int d) {
        String[] str = { "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" };
        String ss[] = new String[] { "个", "十", "百", "千" };
        String s = String.valueOf(d);
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < s.length(); i++) {
            String index = String.valueOf(s.charAt(i));
            sb = sb.append(str[Integer.parseInt(index)]);
        }
        String sss = String.valueOf(sb);
        int i = 0;
        for (int j = sss.length(); j > 0; j--) {
            sb = sb.insert(j, ss[i++]);
        }
        return sb.toString().substring(0, sb.toString().length()-1);
    }
}
