package com.bshinfo.cl.util.formater;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;

public class JSONFormater {

	private static JSONObject json = new JSONObject();
	private static JSONArray jsonArray = new JSONArray();
	
	
	/**
	 * Map<String, Object> 生成json
	 * @param map
	 * @return
	 */
	public static String getJSONString(Map<String, Object> map){
		if(map == null){
			return null;
		}
		return json.fromObject(map).toString();
	}
	
	/**
	 * List<Map<String, Object>> 生成json
	 * @param map
	 * @return
	 */
	public static String getJSONArrayString(List<Map<String, Object>> list){
		if(list == null){
			return null;
		}
		return jsonArray.fromObject(list).toString();
	}
	
	/**
	 * List<Map<String, Object>> 生成json
	 * @param map
	 * @return
	 */
	public static String getJSONArrayString2(List list){
		if(list == null){
			return null;
		}
		return jsonArray.fromObject(list).toString();
	}	
	
    /**
     * Json生成Map  
     * @param jsonString
     * @return
     * @throws JSONException
     */
    public static Map<String, Object> jsonToMap(String jsonString) throws JSONException {
		if(jsonString == null){
			return null;
		}
        //JSONObject必须以"{"开头  
        JSONObject jsonObject = JSONObject.fromObject(jsonString);
        Map<String, Object> resultMap = new HashMap<String, Object>();  
        Iterator<String> iter = jsonObject.keys();  
        String key=null;  
        Object value=null;  
        while (iter.hasNext()) {  
            key=iter.next();  
            value=jsonObject.get(key);  
            resultMap.put(key, value);  
        }  
        return resultMap;  
    }

    /**
     * Json生成List  
     * @param jsonString
     * @return
     * @throws JSONException
     */
    public static List<Map<String, Object>> jsonToListMap(String jsonString) throws JSONException {
		if(jsonString == null){
			return null;
		}    	
    	JSONArray ja = JSONArray.fromObject(jsonString);
        @SuppressWarnings({ "deprecation", "unchecked" })
        List<Map<String,Object>> listBack = JSONArray.toList(ja, HashMap.class);
        return listBack;
    }
    
}  
