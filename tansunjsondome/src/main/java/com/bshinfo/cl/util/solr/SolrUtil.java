package com.bshinfo.cl.util.solr;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.bshinfo.cl.util.formater.Config;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;

public class SolrUtil extends Config {

	public static SolrClient getSolrClient() {
		return new HttpSolrClient(URL + "/" + SERVER);
	}

	public static List<Map<String, Object>>  search(int start,String queryname) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		SolrClient client = getSolrClient();
		SolrQuery query = new SolrQuery();
		//给query设置一个主查询条件  
		query.setQuery(queryname);
		//给query增加过滤查询条件 
		QueryResponse response = null;
		try {
			response = client.query(query);
			SolrDocumentList docs = response.getResults();
			Random random = new Random();
			int max;//最大数
			int min = 1;//最小数
			int s = 1;//随机数
			if (docs.getNumFound() == 0) {
				
			}else {
				if (docs.getNumFound() <= start) {
					for (SolrDocument doc : docs) {
						Map<String, Object> map = new HashMap<String, Object>();
						map.put("id", doc.getFieldValue("id"));
						map.put("le_name", doc.getFieldValue("le_name"));
						map.put("imgurl", doc.getFieldValue("le_imgurl"));
						map.put("remark", doc.getFieldValue("le_remark"));
						list.add(map);
					}
				}else{
					max = (int) (docs.getNumFound()-start);//最大数
					s = random.nextInt(max)%(max-min+1) + min;
					//System.out.println("随机数为："+s);
					int i = 0;
					for (SolrDocument doc : docs) {
						if (i >=s && i < (s+start)) {
							Map<String, Object> map = new HashMap<String, Object>();
							map.put("id", doc.getFieldValue("id"));
							map.put("le_name", doc.getFieldValue("le_name"));
							map.put("imgurl", doc.getFieldValue("le_imgurl"));
							map.put("remark", doc.getFieldValue("le_remark"));
							list.add(map);
						}
						i++;
					}
				}
			}
			
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return list;
	}
	public static List<Map<String, Object>>  search1(int start,int rows,String queryname,String filterquery) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		SolrClient client = getSolrClient();
		SolrQuery query = new SolrQuery();
		//给query设置一个主查询条件  
		query.setQuery(queryname);
		//设置分页参数  
        query.setStart(start);  
        query.setRows(rows);//每一页多少值 
		QueryResponse response = null;
		try {
			response = client.query(query);
			SolrDocumentList docs = response.getResults();
			for (SolrDocument doc : docs) {
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("id", doc.getFieldValue("id"));
				map.put("le_name", doc.getFieldValue("le_name"));
				map.put("imgurl", doc.getFieldValue("le_imgurl"));
				map.put("remark", doc.getFieldValue("le_remark"));
				list.add(map);
			}
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	/**
	 * 查询用户
	 * @param start
	 * @param queryname
	 * @return
	 */
	public static List<Map<String, Object>>  searchUsers(int start,String queryname) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		SolrClient client = getSolrClient();
		SolrQuery query = new SolrQuery();
		//给query设置一个主查询条件  
		query.setQuery(queryname);
		QueryResponse response = null;
		try {
			response = client.query(query);
			SolrDocumentList docs = response.getResults();
			Random random = new Random();
			int max;//最大数
			int min = 1;//最小数
			int s = 1;//随机数
			if (docs.getNumFound() == 0) {
				
			}else {
				if (docs.getNumFound() <= start) {
					for (SolrDocument doc : docs) {
						Map<String, Object> map = new HashMap<String, Object>();
						map.put("id", doc.getFieldValue("id"));
						map.put("text", doc.getFieldValue("tu_text"));
						map.put("name", doc.getFieldValue("tu_name"));
						map.put("tgname", doc.getFieldValue("tu_tgname"));
						list.add(map);
					}
				}else{
					max = (int) (docs.getNumFound()-start);//最大数
					s = random.nextInt(max)%(max-min+1) + min;
					int i = 0;
					for (SolrDocument doc : docs) {
						if (i >=s && i < (s+start)) {
							Map<String, Object> map = new HashMap<String, Object>();
							map.put("id", doc.getFieldValue("id"));
							map.put("text", doc.getFieldValue("tu_text"));
							map.put("name", doc.getFieldValue("tu_name"));
							map.put("tgname", doc.getFieldValue("tu_tgname"));
							list.add(map);
						}
						i++;
					}
				}
			}
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public static void main(String[] args) {
		List<Map<String, Object>> list1 = SolrUtil.search(4,"tu_text:11");
		for (Map<String, Object> map : list1) {
			System.out.println("课程id=========="+map.get("id"));
			System.out.println("课程名称=========="+map.get("le_name"));
			System.out.println("课程图片路径=========="+map.get("le_imgurl"));
			System.out.println("课程简介=========="+map.get("le_remark"));
		}
	}
}
