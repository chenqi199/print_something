package com.bshinfo.cl.dao;

import com.bshinfo.cl.model.Vote;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface VoteMapper {
    /**
     * 删除
     */
    int deleteByPrimaryKey(String id);

    /**
     * 新增
     */
    int insert(Vote record);

    /**
     * 新增
     */
    int insertSelective(Vote record);

    /**
     * 查询
     */
    Vote selectById(String id);

    /**
     * 查询
     */
    List<Vote> selectVote(@Param(value="title")String title,@Param(value="user_id")String user_id,@Param(value="group_id")String group_id,@Param(value="sourcetype")  int sourcetype);

    /**
     * 修改
     */
    int updateByPrimaryKeySelective(Vote record);

    /**
     * 修改
     */
    int update(Vote vote);
    /**
     * 查询
     */
    List<Vote> selectByTitle(String title,@Param(value="user_id")String user_id,@Param(value="group_id")String group_id,@Param(value="sourcetype")  int sourcetype);
   
    Map<String,Object> selectParam(String id);
    /**
     * 根据ID进行删除(物理删除or改状态)
     * @param id
     * @return
     */
    int deleteVoteById(String id);
}