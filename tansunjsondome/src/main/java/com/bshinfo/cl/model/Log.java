package com.bshinfo.cl.model;

import java.io.Serializable;
import java.util.Date;

/** 
 * 业务日志记录POJO 
 */  
public class Log implements Serializable {
      
    private static final long serialVersionUID = 1024792477652984770L;  
  
    private String userid;//管理员id  
    private Date createdate;//日期  
    private String content;//日志内容  
    private String operation;//操作(主要是"添加"、"修改"、"删除"、"Exception")
    private String excepitonSequence;//异常序列号
    public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	private String ip;//日志发送的所在主机ip
	public String getExcepitonSequence() {
		return excepitonSequence;
	}
	public void setExcepitonSequence(String excepitonSequence) {
		this.excepitonSequence = excepitonSequence;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public Date getCreatedate() {
		return createdate;
	}
	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
      
}  