package com.bshinfo.cl.service;

import java.util.List;
import java.util.Map;

import com.bshinfo.cl.model.Vote;

public interface VoteServiceI {
	/**
	 * 新增投票信息
	 * @param vote
	 * @return
	 */
	int insertVote(Vote vote);

	/**
	 * 查询投票信息
	 * @return
     */
	List<Vote>  selectVote(String title,String user_id,String group_id,int sourcetype);

	/**
	 * 根据id查询投票信息
	 * @param id
	 * @return
     */
	Vote selectById(String id);

	/**
	 * 修改投票信息
	 * @param vote
	 * @return
     */
	int update(Vote vote);
	/**
	 * 根据title查询投票信息
	 * @param id
	 * @return
     */
	List<Vote> selectByTitle(String title,String user_id,String group_id,int sourcetype);
	
	Map<String,Object> selectParam(String id);
	/**
     * 根据ID进行删除(物理删除or改状态)
     * @param id
     * @return
     */
    int deleteVoteById(String id);
}
