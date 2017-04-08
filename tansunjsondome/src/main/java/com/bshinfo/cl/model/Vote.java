package com.bshinfo.cl.model;

import java.util.Date;

//投票 投票信息表
public class Vote {
    private String id;
    private String title;// 标题
    private String imgurl;// 图片
    private String remark;
    private Date begintime;// 开始时间
    private Date endtime;// 结束时间
    private Integer modeltype;// 模板个数
    private Integer selectnum;// 选项可选个数
    private String creator;// 创建人
    private Date createtime;// 创建时间
    private String group_id;// 所属机构
    private int idlookResult;//'是否可查看结果 0 不可查看 1 可查看',
    private Integer isdel;
    public String getId() {
        return id;
    }

    public int getIdlookResult() {
        return idlookResult;
    }

    public void setIdlookResult(int idlookResult) {
        this.idlookResult = idlookResult;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    public String getImgurl() {
        return imgurl;
    }

    public void setImgurl(String imgurl) {
        this.imgurl = imgurl == null ? "" : imgurl.trim();
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark == null ? null : remark.trim();
    }

    public Date getBegintime() {
        return begintime;
    }

    public void setBegintime(Date begintime) {
        this.begintime = begintime;
    }

    public Date getEndtime() {
        return endtime;
    }

    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }

    public Integer getModeltype() {
        return modeltype;
    }

    public void setModeltype(Integer modeltype) {
        this.modeltype = modeltype;
    }

    public Integer getSelectnum() {
        return selectnum;
    }

    public void setSelectnum(Integer selectnum) {
        this.selectnum = selectnum;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator == null ? null : creator.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public String getGroup_id() {
        return group_id;
    }

    public void setGroup_id(String group_id) {
        this.group_id = group_id;
    }
    
    public Integer getIsdel() {
		return isdel;
	}

	public void setIsdel(Integer isdel) {
		this.isdel = isdel;
	}

	@Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", title=").append(title);
        sb.append(", imgurl=").append(imgurl);
        sb.append(", remark=").append(remark);
        sb.append(", begintime=").append(begintime);
        sb.append(", endtime=").append(endtime);
        sb.append(", modeltype=").append(modeltype);
        sb.append(", selectnum=").append(selectnum);
        sb.append(", creator=").append(creator);
        sb.append(", createtime=").append(createtime);
        sb.append(", group_id=").append(group_id);
        sb.append(", isdel=").append(isdel);
        sb.append("]");
        return sb.toString();
    }
}