package com.bshinfo.cl.controller;

import com.bshinfo.cl.service.VoteServiceI;
import com.bshinfo.cl.util.formater.Config;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/frontVote")
public class VoteController extends Config {
    @Autowired
    private VoteServiceI voteService;
//    @Autowired
//    private VoteOptionServiceI voteOptionService;
//    @Autowired
//    private VoteUserServiceI voteUserServiceI;
    private static String modulePath = "/front/vote/";
    private JSONArray jsonArray = new JSONArray();


    private JSONObject json = new JSONObject();


    @RequestMapping(value = "/index.do", method = RequestMethod.GET, produces = "text/html;charset=UTF-8")
    public ModelAndView index() {
        Map<String, Object> model = new HashMap<String, Object>();
        return new ModelAndView(modulePath + "homePage", "result", model);
    }


	@RequestMapping(value = "/data.do", method = RequestMethod.GET, produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String data(HttpServletRequest request,String title) {
		json.clear();
//		User user = (User)request.getSession(true).getAttribute(SXYSessionUtils.USER);
//		String groupid = user.getGroup_id();
//		List<Vote> votes = voteService.selectVote(title,user.getId(),groupid,1);
////		Map<String,Vote> map = new HashMap<String, Vote>();
////		for(int i = 0;i < 1 ;i++){
////			map = new HashMap<String, String>();
////			map = votes.get(0);
////			for(String key :map.keySet()){
////				System.err.println("key:"+key + "and value:"+map.get(key));
////			}
////		}
////		map.put("vote",votes.get(0));
////		json.put("model", map);
        json.put("model", "{1:1}");
        return json.toString();
    }

    @RequestMapping(value = "/addOne.do", method = RequestMethod.GET, produces = "text/html;charset=UTF-8")
    public ModelAndView addOne() {
        Map<String, Object> model = new HashMap<String, Object>();
        return new ModelAndView(modulePath + "add", "result", model);
    }

    @RequestMapping(value = "/add.do", method = RequestMethod.POST)
    @ResponseBody @Transactional
    public String add(String vote, String inputs, String voteUsers, HttpServletRequest request, HttpServletResponse response) throws ParseException {

        json.clear();
//        int sumInsert = 0;
//        User user = (User) request.getSession().getAttribute(SXYSessionUtils.USER);
//        Vote vote1 = JSON.parseObject(vote, Vote.class);
//        if (!vote1.getTitle().isEmpty() || !vote1.getId().isEmpty()) {
//            if (vote1.getImgurl() == null || "".equals(vote1.getImgurl())) {
//                vote1.setImgurl(GetDefaultPicture.getImage());
//            }
//            vote1.setId(UUIDTool.randomUUID());
//            vote1.setCreator(user.getId());
//            vote1.setGroup_id(user.getGroup_id());
//            vote1.setCreatetime(new Date());
//            sumInsert = voteService.insertVote(vote1);
//        }
//        List<VoteUser> listvus = new ArrayList<VoteUser>();//添加投票人员
//        String[] voteUs = voteUsers.split(",");
//        for (int i = 0; i < voteUs.length; i++) {
//            VoteUser voteUser = new VoteUser();
//            voteUser.setId(UUIDTool.randomUUID());
//            voteUser.setVid(vote1.getId());
//            voteUser.setCreatetime(new Date());
//            voteUser.setUser_id(voteUs[i]);
//            voteUser.setCreator(user.getId());
//            voteUser.setPartition1_id(1);
//            listvus.add(i, voteUser);
//        }
//        List<VoteOption> listOption = new ArrayList<VoteOption>();//投票选项
//        String[] input = inputs.split(",");
//
//        for (int i = 0; i < input.length; i++) {
//            VoteOption voteOption = new VoteOption();
//            voteOption.setId(UUIDTool.randomUUID());
//            voteOption.setVote_id(vote1.getId());
//            voteOption.setOption(input[i]);
//            voteOption.setLindex(i);
//            listOption.add(voteOption);
//        }
//        voteUserServiceI.insertlistVoteUsers(listvus);
//        int sum = voteOptionService.insertSelective(listOption);
//        if (sumInsert > 0 && sum > 0) {
//            json.put("success", true);
//            json.put("msg", "成功");
//        } else {
//            json.put("success", false);
//            json.put("msg", "失败");
//        }
        return json.toString();
    }


    /**
     * 根据vote中的id跳转页面到课程管理
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/edit.do", method = RequestMethod.GET)
    public ModelAndView edit(String id) {
        Map<String, Object> model = new HashMap<String, Object>();
        jsonArray.clear();
//      String voteUsers=voteUserServiceI.selectByVoteId(id);
//        Vote vote = null;
//        if (null != id && !"".equals(id)) {
//            model.put("vote", voteService.selectParam(id));
//            model.put("voteUsers",voteUsers );//投票人员id
//
//            model.put("gkurl", Config.GKURL + "vote/");
//            model.put("method", "edit");
//        } else {
//            vote = new Vote();
//            model.put("vote", vote);
//            model.put("gkurl", Config.GKURL + "vote/");
//            model.put("method", "add");
//        }
        return new ModelAndView(modulePath + "index", "model", model);
    }

    /**
     * 根据id修改投票信息
     *
     * @param vote
     * @return
     */
    @RequestMapping(value = "/update.do", method = RequestMethod.POST)
    @ResponseBody @Transactional
    public String update(HttpServletRequest request, String inputs, String voteUsers, String vote) {
        json.clear();
        int successMnu = 0;
//        User user = (User) request.getSession().getAttribute(SXYSessionUtils.USER);
//
//
//        Vote vote1 = JSON.parseObject(vote, Vote.class);//将json转为对象
//        if (vote1.getImgurl() == null || "".equals(vote1.getImgurl())) {
//            vote1.setImgurl(GetDefaultPicture.getImage());
//        }
//        voteOptionService.deleteByPrimaryKey(vote1.getId());/*全部删除*/
//        voteUserServiceI.deleteVoteUsersByVoteId(vote1.getId());//删除投票人员重新插入
//
////        voteUserServiceI.deleteVoteUsersByVoteId(vote1.getId());
//        List<VoteUser> listvus = new ArrayList<VoteUser>();//添加投票人员
//        if (!"".equals(voteUsers)&&voteUsers!=null){
//
//            String[] voteUs = voteUsers.split(",");
//            for (int i = 0; i < voteUs.length; i++) {
//                VoteUser voteUser = new VoteUser();
//                voteUser.setId(UUIDTool.randomUUID());
//                voteUser.setVid(vote1.getId());
//                voteUser.setCreatetime(new Date());
//                voteUser.setUser_id(voteUs[i]);
//                voteUser.setCreator(user.getId());
//                voteUser.setPartition1_id(1);
//                listvus.add(i, voteUser);
//            }
//            voteUserServiceI.insertlistVoteUsers(listvus);
//        }
//        List<VoteOption> listOption = new ArrayList<VoteOption>();
//        String[] input = inputs.split(",");
//
//        for (int i = 0; i < input.length; i++) {
//            VoteOption voteOption = new VoteOption();
//            voteOption.setId(UUIDTool.randomUUID());
//            voteOption.setVote_id(vote1.getId());
//            voteOption.setOption(input[i]);
//            voteOption.setLindex(i);
//            listOption.add(voteOption);
//        }
//
//        successMnu = voteService.update(vote1);
//        int sum = voteOptionService.insertSelective(listOption);
//
//        if (successMnu > 0 && sum > 0) {
//            json.put("success", true);
//            json.put("msg", "成功");
//        } else {
//            json.put("success", false);
//            json.put("msg", "失败");
//        }
        return json.toString();

    }

    /**
     * 删除投票(真正删除or修改状态)
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/deleteVoteById.do", method = RequestMethod.GET, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String deleteVoteById(String id) {
        json.clear();
        int sumVote = 0;
        if (id != null && !"".equals(id)) {
            sumVote = voteService.deleteVoteById(id);
        }
        if (sumVote > 0) {
            json.put("success", true);
            json.put("msg", "成功");
        } else {
            json.put("success", false);
            json.put("msg", "失败");
        }
        return json.toString();
    }
}