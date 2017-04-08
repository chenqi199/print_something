package com.bshinfo.cl.service;

import com.bshinfo.cl.dao.VoteMapper;
import com.bshinfo.cl.model.Vote;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("voteServiceI")
public class VoteServiceImpl  implements VoteServiceI {
    @Autowired
    private VoteMapper voteMapper;

    private JSONObject json = new JSONObject();

    @Override
    public int insertVote(Vote vote) {
        return voteMapper.insertSelective(vote);
    }


    @Override
    public List<Vote> selectVote(String title,String user_id,String group_id,int sourcetype) {
        return voteMapper.selectVote(title,user_id,group_id,sourcetype);
    }

    @Override
    public Vote selectById(String id) {
        return voteMapper.selectById(id);
    }

    @Override
    public int update(Vote vote){
        return voteMapper.update(vote);
    }

    @Override
    public Map<String, Object> selectParam(String id) {
    	return voteMapper.selectParam(id);
    }


	@Override
	public List<Vote> selectByTitle(String title,String user_id,String group_id,int sourcetype) {
		return voteMapper.selectByTitle(title,user_id,group_id,sourcetype);
	}


	@Override
	public int deleteVoteById(String id) {
		return voteMapper.deleteVoteById(id);
	}
}
