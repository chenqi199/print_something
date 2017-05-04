//新意见格式
function showXmlOpinion_new(OpinionStyle,ideaDiv,zqyjXML,divShow,columnName,type){
/*
集成意见展示的所有格式，比原有方法增加了第一个参数OpinionStyle
通过改变该参数调用不同方法展示的样式
参数及对应的样式需求：
1，"fw_SingleDept"，发文模块单个部门的样式
无附件，字号较大，落款另起一行靠右，多条意见按时间逆序
发文模块单个部门的意见域调用此方法

2，"sw_SingleDept"，收文及其他模块单个部门的样式
无附件，字号较大，落款与意见同行展示，多条意见按时间顺序
收文及其他模块单个部门的意见域调用此方法

3，"fw_MultiDept"，发文模块多个部门的样式
如果有行领导意见，在最上面展示，按领导排名顺序
字号较小，意见落款同行展示，多条意见按时间顺序，附件在第一个人的意见与落款之间
所有模块的会签、传阅意见多个部门时调用此方法

4，"hq_SingleDept"
不带部门，字号较小，落款与意见同行展示，多条意见按时间顺序，附件链接展示在意见与署名之间
所有模块会签单个部门时调用此方法

5，"sw_MultiDept"，收文及其他模块多个部门的样式
字号较小，落款与意见同行展示，多条意见按时间顺序，附件链接在此部门所有人的意见最后
所有模块的协办意见多个部门时调用此方法

6，"xb_SingleDept"
不带部门，字号较小，落款与意见同行展示，多条意见按时间顺序，附件链接在此部门所有人的意见最后
所有模块的协办意见单个部门时调用此方法

7，"sw_NoDept"，承办意见样式（收文，签报）
字号较小，多条意见顺序，无部门，无附件，意见与落款同行展示

8，"hwhqyj"，行外会签意见
字号较小，无部门、落款、附件，按时间逆序

sml，2011-3-1
*/
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")
	//去掉会签/协办意见附加最后的一个换行
	XMLOpinion=XMLOpinion.replace(/\%\%br\*\*<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	var resulting = pagesource.transformNode(style)
        //alert("OpinionStyle----"+OpinionStyle+"----ideaDiv---"+ideaDiv);
	switch(OpinionStyle){
			//指定部门、拟稿部门、单个部门意见
		case "fw_SingleDept":
			LoadOpinionXml_fwsingle(divShow,resulting)
			break
		case "sw_SingleDept":
			LoadOpinionXml_swsingle(divShow,resulting)
			break
			//会签意见
		case "hq_SingleDept":
		case "fw_MultiDept":
			LoadOpinionXml_fwmulti(OpinionStyle,divShow,resulting)
			break
			//协办意见
		case "xb_SingleDept":
		case "sw_MultiDept":
			LoadOpinionXml_swmulti(OpinionStyle,divShow,resulting)
			break
			//承办意见
		case "sw_NoDept":
			LoadOpinionXml_swno(divShow,resulting)
			break
			//行外会签意见
		case "hwhqyj":
			LoadOpinionXml_hwhqyj(divShow,resulting)
			break
		default:	
	}		
}

function DealDateStr(datestr){
//时间格式统一方法
	if(datestr.indexOf(" ")!=-1 && datestr.split(" ").length==2){
		var date=datestr.split(" ")[0]
		var time=datestr.split(" ")[1]
		if(date.indexOf("-")!=-1 && date.split("-").length==3 && time.indexOf(":")!=-1 && time.split(":").length>=2){
			var tmp=""
			var month=date.split("-")[1]
			var day=date.split("-")[2]
			var hour=time.split(":")[0]
			var minute=time.split(":")[1]
			if(month.substr(0,1)=="0"){
				month=month.substr(1)
			}
			if(day.substr(0,1)=="0"){
				day=day.substr(1)
			}
			if(hour.substr(0,1)=="0"){
				hour=hour.substr(1)
			}
			tmp="<font size=3>"+month+"-"+day+"&nbsp&nbsp"+hour+":"+minute+"</font>"
			return tmp
		}
	}
	else if(datestr.indexOf("-")!=-1 && datestr.split("-").length==3){	//意见时间只有年月日的情况 pengte 2011/03/03
		var tmp=""
		var month=datestr.split("-")[1]
		var day=datestr.split("-")[2]	
		if(month.substr(0,1)=="0"){
			month=month.substr(1)
		}
		if(day.substr(0,1)=="0"){
			day=day.substr(1)
		}		
		tmp="<font size=3>"+month+"-"+day+"</font>"
		return tmp
	}
	return datestr
}
function showbhideaForCK(){
//“查看退回说明“表单中使用
try{
	//环节信息
	J_BackNodes=P$("TakeBackNode").value;
	J_BacktTos =P$("TakeBackToNode").value;
	if(J_BackNodes && J_BacktTos){
		//处理人信息
		J_BankToPer =""
		if(P$("TakeBackToPer")){
			J_BankToPer =P$("TakeBackToPer").value;
		} 
		J_BankDealPer =""
		if(P$("TakeBackDealPer")){
			J_BankDealPer =P$("TakeBackDealPer").value;
		}
		var openuser = P$("openUser").value;
	}else{
		return "<div align=center>没有退回信息。</div>"
	}

	var BackPerList = J_BankDealPer.split(";");
	var BackToPerList  = J_BankToPer.split(";");
	var BackNodeList = J_BackNodes.split(";");
	var BackToList = J_BacktTos.split(";");
	var BackNodeIdea=P$("divXML_BHidea").innerHTML;
	//alert(BackNodeIdea)
	if(BackNodeIdea=="")	return false;
	//将XML意见加上头尾
	var BackNodeIdea="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+BackNodeIdea+"</ideaitems>";
  //避免把退回意见转换为了小写，去掉toLowerCase()方法，单个替换Attribute的大小写
	//BackNodeIdea=BackNodeIdea.toLowerCase()
	BackNodeIdea=BackNodeIdea.replace(/<IDEAITEM/gi,"<ideaitem")
	BackNodeIdea=BackNodeIdea.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	BackNodeIdea=BackNodeIdea.replace(/<ITEM/gi,"<item")
	BackNodeIdea=BackNodeIdea.replace(/<\/ITEM>/gi,"</item>")
	
	BackNodeIdea=BackNodeIdea.replace(/&lt;/g,"<");
	BackNodeIdea = BackNodeIdea.replace(/&gt;/g,">");
	BackNodeIdea = BackNodeIdea.replace(/<BR>/g,"");
	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	XMLOpinionDoc.loadXML(BackNodeIdea);
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
	   return false;
	}

	var BackInfoList=new Array()
	var len=0
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
			var PerBackInfo=""
		        //意见落款人当前部门
			var department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			if(department_receiver.indexOf(";")){		//如果是多部门(临时处理)
				department_receiver=department_receiver.substr(0,department_receiver.indexOf(";"))
			}
		        //意见落款人当前部门编号
			var department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		        //意见落款人一级部门
			var firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			if(firstdepart_receiver.indexOf(";")){		//如果是多部门(临时处理)
				firstdepart_receiver=firstdepart_receiver.substr(0,firstdepart_receiver.indexOf(";"))
			}
			
		        //意见落款人一级部门编号
			var firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
		        //意见落款人中文名
			var chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
		        //落款意见
			var signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
		        //落款时间		        
			var signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;			
		        //代理人信息
			var warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			
			signedtime=DealDateStr(signedtime)
			PerBackInfo="<td width=25% style=font-family:宋体;font-size:11pt;text-align:left;>"+signidea+"</td>"
			PerBackInfo+="<td width=25% style=font-family:宋体;font-size:11pt;text-align:center;>"+signedtime+"</td>"
			BackInfoList[len]=PerBackInfo
			len++
		}
	}    

	var tempsresult="";

	for(var j=0;j<BackInfoList.length;j++){
		var BackPerListEN=BackPerList[j]
		var BackPerToListEN=BackToPerList[j]
		//alert(BackPerToListEN);
		if(BackInfoList[j]==""||(BackPerListEN!=openuser&&BackPerToListEN.indexOf(openuser)==-1)){
			continue
		}
		//如果被退回人员中有$%$，则BackPerToListEN中同时存了代理人信息，需要对BackPerToListEN进行处理，取出实际被退回人，展示在退回说明中
		if(BackPerToListEN.indexOf("$%$")!=-1){
			 BackPerToListEN = BackPerToListEN.split("$%$")[0];
		}
		BackInfoList[j] = BackInfoList[j].replace(/%@##@%;/gi,"&nbsp;");
		BackInfoList[j] = BackInfoList[j].replace(/%#@@#%/gi,"<br>");
		
		if(BackPerListEN.indexOf("/")!=-1){
			var tmparr=getUserByFullName(BackPerListEN)
			var BackPerListCN=tmparr[1]
		}
		//alert(BackPerToListEN);
		if(BackPerToListEN.indexOf("/")!=-1){
			var tmparr=getUserByFullName(BackPerToListEN)
			var BackPerToListCN=tmparr[1]
		}
		var backnode="<td width=25% style=font-family:宋体;font-size:11pt;text-align:center;>"+BackNodeList[j]+"<br>("+BackPerListCN+")"+"</td>";
		var tonode = "<td width=25% style=font-family:宋体;font-size:11pt;text-align:center;>"+BackToList[j]+"<br>("+BackPerToListCN+")"+"</td>";
	
		if(tempsresult==""){
			tempsresult ="<tr class=biao-bg>"+ backnode + tonode + BackInfoList[j] +"</tr>"
		}else{
			tempsresult = tempsresult +"<tr class=biao-bg>"+ backnode + tonode + BackInfoList[j] +"</tr>"
		}
	}
	var tablehead ="<table width=\"100%\" height=\"25\" border=\"0\" align=\"center\" cellspacing=\"1\" class=\"biankuang\" >"
	        +"<tr class=\"biaotou\">" 
	        +"<td width=25%>执行环节</td>"
		   +"<td width=25%>退回环节</td>"
	        +"<td width=25%>退回说明</td>"
	        +"<td width=25%>退回时间</td>"
	        +"</tr>"
	var tableend="</table>"
	tempsresult = tablehead+tempsresult+tableend

	return tempsresult;
}catch(err){
	alert("外部文件中函数showbhidea出错 : "+err.description)
	return ""
}
}

function LoadOpinionXml_hwhqyj(divShow,XMLOpinion){
	if(E(divShow)==null)	return
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";
	//会签/协办意见附加在该部门的所有人意见最后展示
	//var CurDeptName=""		
	//var LastDeptName="";	//上一意见部门名称
	
	//收文模块所有意见按时间顺序
	for (i=0;i<OpiniondocEle.childNodes.length;i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		          var tmpAttach = "";
				tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"<br>"+blankstr);		
				 }     
				 curAttachFinally = tmpAttach;
			}
		      //有效的意见条目    
		      if(signidea){
                           if (signidea=="%@##@%;")
				TableContent+="";
                           else 
				TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+"</td></tr>"
			}
		}
	}        
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
}
function LoadOpinionXml_fwmulti(OpinionStyle,divShow,XMLOpinion){
	if(E(divShow)==null)	return
	if(document.all.LeaderMembers){
		var LeaderMembers=document.all.LeaderMembers.value;
		var ldList=LeaderMembers.split(";");
	}
	var deptList =new Array();
	var deptNoList=new Array();
	var firstDeptList =new Array();
	var firstDeptNoList=new Array();
	var cNameList =new Array();
	var ideaList=new Array();
	var timeList =new Array();
	var warrantList=new Array();
	var itemId=new Array();
	var AttContentList=new Array()
	var flagList=new Array()
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";
	//会签/协办意见附加在该部门的所有人意见最后展示
	//var CurDeptName=""		
	var AttContent=""
	//var LastDeptName="";	//上一意见部门名称
	
	//按时间顺序
	for (i=OpiniondocEle.childNodes.length-1;i>=0;i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
			
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		          var tmpAttach = "";
				tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");
					//added by dongjun on 20110303
					tmpAttach = checkAttachforOne(tmpAttach);
				 }     
				 curAttachFinally = tmpAttach;
                        //alert(tmpNode.selectSingleNode("item[@name='curattachfinally']").text);
			}
			//将信息存放在数组中，再对数组排序
			deptList.push(department_receiver);
			deptNoList.push(department_deptno);
			firstDeptList.push(firstdepart_receiver);
			firstDeptNoList.push(firstdepart_deptno);
			cNameList.push(chinesename_receiver);
			ideaList.push(signidea);
			timeList.push(signedtime);
			warrantList.push(warrantstrold);
			//itemId.push(id);
                        //alert("curAttachFinally==="+curAttachFinally)
			AttContentList.push(curAttachFinally)
			//alert("signidea===="+signidea)
			//alert("curAttachFinally==="+curAttachFinally)
		}
	}

	//indexList数组记录部门编号从小到大排序的数组下标
	var indexList=new Array();
	//记录数组下标，根据行领导顺序
	if(ldList){
		for(var a=0;a<ldList.length;a++){
			for(var b=0;b<cNameList.length;b++){
				if(ldList[a].replace(/\s/gi,"")==cNameList[b].replace(/\s/gi,"")){
					indexList.push(b);	
				}
			}
		}
	}

	//如不是行领导，则放在后面
	for(var s=0;s<cNameList.length;s++){
		var flag=false;
		for(var t=0;t<indexList.length;t++){
			if(indexList[t]==s){
				flag=true;
				break;
			}
		}
		flagList.push(flag)
		if(flag==false)	indexList.push(s);
	}
	for(var t=0;t<indexList.length;t++){
		var a=indexList[t];
		
		signidea=ideaList[a]
		firstdepart_receiver=firstDeptList[a]
		chinesename_receiver=cNameList[a]
		signedtime=timeList[a]
		department_receiver=deptList[a]
		department_deptno=deptNoList[a]
		firstdepart_deptno=firstDeptNoList[a]
		warrantstrold=warrantList[a]
		//id=itemId[a]
		flag=flagList[a]
		//alert(AttContentList[a])
		if(AttContentList[a])
			AttContent=AttContentList[a]
		//alert("TableContent==="+TableContent)
		//alert("AttContent=="+AttContent)
		//有效的意见条目    
		if(signidea && firstdepart_receiver && chinesename_receiver && signedtime){
				//落款时间处理(不要年份和时间,字号小)
				signedtime=DealDateStr(signedtime)
				if(warrantstrold!=""){
					chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
				}
				NameAndTimeStr=chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr
				//alert(TableContent)
				//区别行领导与部门意见的样式
				if(flag){
                                  if (signidea=="%@##@%;") 
					TableContent+="<tr><td "+StyleStr+">"+blankstr+NameAndTimeStr+"</td></tr>"
                                   else 
					TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+blankstr+NameAndTimeStr+"</td></tr>"
					//TableContent+="<tr><td "+StyleStr+";text-align:right;>"+blankstr+NameAndTimeStr+"</td></tr>"
				}else if(OpinionStyle!="hq_SingleDept"){
              if (signidea=="%@##@%;"){
                 if(AttContent!=""){
					    		  	TableContent+="<tr><td "+StyleStr+">"+blankstr+"<font color=blue>"+firstdepart_receiver+"</font>："+AttContent+blankstr+NameAndTimeStr+"</td></tr>";
					    	 }else{
					    				TableContent+="<tr><td "+StyleStr+">"+blankstr+"<font color=blue>"+firstdepart_receiver+"</font>："+AttContent+NameAndTimeStr+"</td></tr>";
					    	 }
              }else {
                     	TableContent+="<tr><td "+StyleStr+">"+blankstr+"<font color=blue>"+firstdepart_receiver+"</font>："+signidea+blankstr+AttContent+blankstr+NameAndTimeStr+"</td></tr>"
					
						 }
               AttContent="";
	
				}else{
              if (signidea=="%@##@%;"){ 
									TableContent+="<tr><td "+StyleStr+">"+AttContent+blankstr+NameAndTimeStr+"</td></tr>"
              }else{ 
									TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+blankstr+AttContent+blankstr+NameAndTimeStr+"</td></tr>"
									
							}
               AttContent="";

				}

		}
	}
		      
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
} 
function LoadOpinionXml_fwmultiBak(OpinionStyle,divShow,XMLOpinion){
	if(E(divShow)==null)	return
	
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";
	//会签/协办意见附加在该部门的所有人意见最后展示
	//var CurDeptName=""		
	var AttContent=""
	//var LastDeptName="";	//上一意见部门名称
	
	//收文模块所有意见按时间顺序
	for (i=OpiniondocEle.childNodes.length-1;i>=0;i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		          var tmpAttach = "";
				tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
			}
			if(curAttachFinally){
				AttContent=curAttachFinally
			}

		      //有效的意见条目    
		      if(signidea && firstdepart_receiver && chinesename_receiver && signedtime){
				signedtime=DealDateStr(signedtime)
				if(warrantstrold!=""){
					chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
				}
				NameAndTimeStr=chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr
				if (signidea=="%@##@%;")
				 TableContent+="<tr><td "+StyleStr+">"+blankstr+"<font color=blue>"+firstdepart_receiver+"</font>"+"："+blankstr+AttContent+blankstr+NameAndTimeStr+"</td></tr>";
                           else 
				 TableContent+="<tr><td "+StyleStr+">"+blankstr+"<font color=blue>"+firstdepart_receiver+"</font>"+"："+signidea+blankstr+AttContent+blankstr+NameAndTimeStr+"</td></tr>"
				AttContent=""	

			}
		}
	}        
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
}  
function LoadOpinionXml_swno(divShow,XMLOpinion){
	if(E(divShow)==null)	return
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";
	//会签/协办意见附加在该部门的所有人意见最后展示
	//var CurDeptName=""		
	//var LastDeptName="";	//上一意见部门名称
	
	//收文模块所有意见按时间顺序
	for (i = OpiniondocEle.childNodes.length-1; i >=0; i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		          var tmpAttach = "";
				tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"<br>"+blankstr);		
				 }     
				 curAttachFinally = tmpAttach;
			}
		      //有效的意见条目    
		      if(signidea && firstdepart_receiver && chinesename_receiver && signedtime){
				signedtime=DealDateStr(signedtime)
				if(warrantstrold!=""){
					chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
				}
				NameAndTimeStr=chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr
                            //modified by dcl 20110422 修改自动署名意见对齐方式    start  ================                   
                    if (signidea=="%@##@%;")
                          TableContent+="<tr><td "+StyleStr+">"+blankstr+NameAndTimeStr+"</td></tr>"
                    else  
			     TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+blankstr+NameAndTimeStr+"</td></tr>"
                           //modified by dcl 20110422 修改自动署名意见对齐方式    end =============================
			}
		}
	}        
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
}

function LoadOpinionXml_swsingle(divShow,XMLOpinion){
	if(E(divShow)==null)	return
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
	//var StyleStr=""
	//var blankstr="&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";

	//收文模块所有意见按时间顺序
	for (i=OpiniondocEle.childNodes.length-1;i>=0;i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  //alert(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		      //有效的意见条目    

		      if(signidea && firstdepart_receiver && chinesename_receiver && signedtime){

				signedtime=DealDateStr(signedtime)
				if(warrantstrold!=""){
					chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
				}
				NameAndTimeStr=chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr
				//TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+blankstr+NameAndTimeStr+"</td></tr>"
                //modified by dcl 20110421  增加如果意见为空，则意见与署名间不加空格  start  ==============
				if(signidea=="%@##@%;")
					TableContent+="<tr><td "+StyleStr+">"+blankstr+NameAndTimeStr+"</td></tr>"
				else 
					TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+blankstr+NameAndTimeStr+"</td></tr>"
				 //modified by dcl 20110421  增加如果意见为空，则意见与署名间不加空格  end  ==============
				//TableContent+="<tr><td "+StyleStr+";text-align:right;>"+NameAndTimeStr+"</td></tr>"
			}
			//alert(TableContent)
			//alert(LastNewDeptFlag)	
			//alert(CurNewDeptFlag)	

		}
	} 
	//alert(TableContent)       
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
}
function LoadOpinionXml_fwsingle(divShow,XMLOpinion){
	if(E(divShow)==null)	return
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
	//var StyleStr=""
	//var blankstr="&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	//document.write(XMLOpinionDoc.xml);
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert("XMLOpinion=="+XMLOpinion+"_______"+OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";

	//收文模块所有意见按时间顺序
	for (i=0;i<OpiniondocEle.childNodes.length;i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
                     // alert("signidea==="+signidea);
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		      //有效的意见条目    
		      if(signidea && firstdepart_receiver && chinesename_receiver && signedtime){
				signedtime=DealDateStr(signedtime)
				if(warrantstrold!=""){
					chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
				}
				NameAndTimeStr=chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr
                     //    TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+"</td></tr>";
                     //added by dcl  20110416   增加如果意见为空，则不显示意见行   start=====================
                        if (signidea!=="%@##@%;")
                            {
                           TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+"</td></tr>";
                              }
                     //added by dcl  20110416   增加如果意见为空，则不显示意见行   end =======================
				TableContent+="<tr><td "+StyleStr+";text-align:right;>"+NameAndTimeStr+"</td></tr>"
			}
			//alert(TableContent)
			//alert(LastNewDeptFlag)	
			//alert(CurNewDeptFlag)	

		}
	}        
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
}


function LoadOpinionXml_swmulti(OpinionStyle,divShow,XMLOpinion){
	if(E(divShow)==null)	return
	
	//单元格内样式控制
	var StyleStr='style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px'
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/\s/gi,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	//var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	//var tablehead = "<table width=100% border=0 align=center>";
	var tableend = "</table>";
	var TableContent="";
	
	//var SignIdeaTR="";
	//var SignIdeaDeptTR="";
	var NameAndTimeStr="";
	//会签/协办意见附加在该部门的所有人意见最后展示
	//var CurDeptName=""		
	var AttContent=""
	var LastNewDeptFlag=false
	var CurNewDeptFlag=false
	//var LastDeptName="";	//上一意见部门名称
	
	//收文模块所有意见按时间顺序
	for (i = OpiniondocEle.childNodes.length-1; i >=0; i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       //SignIdeaTR="";
			  //SignIdeaDeptTR="";
			  NameAndTimeStr="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			 	  if(E("modelName")&&E("modelName").value=="dubanfile" && firstdepart_receiver.indexOf("/")!=-1){
			  		firstdepart_receiver = firstdepart_receiver.substring(0,firstdepart_receiver.indexOf("/"));
			  	}
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		       	CurNewDeptFlag=true
		          var tmpAttach = "";
				tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"<br>"+blankstr);
					//added by dongjun on 20110303
					tmpAttach = checkAttachforOne(tmpAttach);
				 }     
				 curAttachFinally = tmpAttach;
			}else{
				CurNewDeptFlag=false
			}
		      //有效的意见条目    
		      if(signidea && firstdepart_receiver && chinesename_receiver && signedtime){
				signedtime=DealDateStr(signedtime)
				if(warrantstrold!=""){
					chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
				}
				NameAndTimeStr=chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr
				//alert(TableContent)
				
				if(LastNewDeptFlag && !CurNewDeptFlag && OpinionStyle!="xb_SingleDept"){
					//该部门意见的第一条
                                   if (signidea=="%@##@%;")
                                           TableContent+="<tr><td "+StyleStr+">"+"<font color=blue>"+firstdepart_receiver+"</font>："+NameAndTimeStr+"</td></tr>"
                                     else 
					        TableContent+="<tr><td "+StyleStr+">"+"<font color=blue>"+firstdepart_receiver+"</font>："+signidea+blankstr+NameAndTimeStr+"</td></tr>"
				}else{
                                   if (signidea=="%@##@%;")
					TableContent+="<tr><td "+StyleStr+">"+blankstr+NameAndTimeStr+"</td></tr>"       
                                  else 
					TableContent+="<tr><td "+StyleStr+">"+blankstr+signidea+blankstr+NameAndTimeStr+"</td></tr>"
				}

			}
			//alert(TableContent)
			//alert(LastNewDeptFlag)	
			//alert(CurNewDeptFlag)	

			if((!LastNewDeptFlag && CurNewDeptFlag)||i==0){
				//追加会签协办意见附加
				if(AttContent)
					TableContent+="<tr><td "+StyleStr+">"+blankstr+AttContent+"</td></tr>"
				AttContent=""
				if(curAttachFinally){
					AttContent=curAttachFinally
				}
			}
			LastNewDeptFlag=CurNewDeptFlag
		}
	}        
	TableContent=TableContent.replace(/%@##@%;/gi,"&nbsp;");
	TableContent=TableContent.replace(/%#@@#%/gi,"<br>");
				
	E(divShow).innerHTML=tablehead+TableContent+tableend;
}  

function GetTableRatioWidth(divShowName,charWidth,nestRatioWidth){
//根据展示单元格的宽度，得到表格的宽度比例
//divShowName,展示单元格名
//charWidth,单个字符宽度
//nestRatioWidth,单元格内嵌套的宽度比例,没有嵌套时为1

	if(E(divShowName)){
		var obj=E(divShowName)
	}else return 100
	
	var objWidth=obj.offsetWidth*parseFloat(nestRatioWidth)
	var tableWidth=objWidth-parseInt(charWidth)*4
	var ratioWidth=tableWidth/objWidth*100
	if(ratioWidth<0){
		ratioWidth=100
	}
	return ratioWidth
}

//会签意见多部门展示
function showXmlOpinionMultiDept(ideaDiv,zqyjXML,divShow,columnName,type){
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	
	var resulting = pagesource.transformNode(style);
	
	if(resulting!=""){
		LoadOpinionXmlMultiDept(divShow,resulting);
	}
}


/*
  功能： 按时间降序显示XML意见
	add by ysw 0805
*/
function LoadOpinionXmlMultiDept(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");			
				 }     
				 curAttachFinally = tmpAttach;
			  }   
		      //意见内容     
		      if(signidea!=""){
		      	if(firstdepart_receiver!=""){
		       		SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+firstdepart_receiver+"："+signidea+"</td></tr>";
			 	}else{
			 	 	SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+department_receiver+"："+signidea+"</td></tr>";
				}
		     }
		     //附件链接
		      if(curAttachFinally!=""){
		    		 SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			//清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}

			if(signidea!=""){	 
			  	if(firstdepart_receiver!=""){
		       	 	 SignIdeaDeptTR = SignIdeaDeptTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+firstdepart_receiver+"</td>";
		      	}else{
		        		 SignIdeaDeptTR = SignIdeaDeptTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+department_receiver+"</td>";
		     	}
		     	SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 //意见表格中落款日期时间
		     	 if(signedtime!=""){
		     		 SignNameAndTimeTR = "<tr>";
		     		 SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;text-align:right;>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		 SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 }
		
				if(TmpTableTR==""){
					TmpTableTR= SignIdeaTR + AttachTR + SignNameAndTimeTR;
				}else if(firstdepart_receiver==LastDepartment){
					TmpTableTR= TmpTableTR +SignIdeaTR + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR + SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				//替换回换行字符
				//TmpTableTR = TmpTableTR.replace("$#@@#$","<br>");
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  



//为会签最终意见定制,useless
function showXmlOpinionHQFinal(ideaDiv,zqyjXML,divShow,columnName,type){
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	
	var resulting = pagesource.transformNode(style);
	
	if(resulting!=""){
		LoadOpinionXmlHQFinal(divShow,resulting);
	}
}

/*
  功能： 按时间降序显示XML意见,为会签最终意见定制,useless
	add by ysw 0805
*/
function LoadOpinionXmlHQFinal(divShow,XMLOpinion){
 	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
	
	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null || XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	
	var tablehead = "<table width=90% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
		       var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
			  }   
		      //意见内容     
		      if(signidea!="" && signidea!=="%@##@%;"){
		     	 SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+signidea+"</td></tr>";
			 }
		     //附件链接
		      if(curAttachFinally!=""){
		    		 SignIdeaTR = SignIdeaTR+ "<tr><td><table width=90% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
					TmpTableTR=  SignIdeaDeptTR;
				}else{
					TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}

			if(signidea!=""){	 
			  	if(firstdepart_receiver!=""){
		       	 	 SignIdeaDeptTR = SignIdeaDeptTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+firstdepart_receiver+"</td>";
		      	}else{
		        		 SignIdeaDeptTR = SignIdeaDeptTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+department_receiver+"</td>";
		     	}
		     	SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 //意见表格中落款日期时间
		     	 if(signedtime!=""){
		     		 SignNameAndTimeTR = "<tr>";
		     		 SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;text-align:right;>"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+"</td>";
		    	 		 SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 }
		
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+"<tr><td><table border=0 width=90% align=center>"+ SignIdeaTR + AttachTR + SignNameAndTimeTR+"</table></td></tr>"
				}else if(firstdepart_receiver==LastDepartment){
					TmpTableTR= TmpTableTR +"<tr><td><table border=0 width=90% align=center>"+SignIdeaTR +AttachTR + SignNameAndTimeTR+"</table></td></tr>"
				}else{
					TmpTableTR= TmpTableTR +"<tr><td><table border=0 width=90% align=center>"+SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR+"</table></td></tr>"
				}
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}

}  




//会签时显示会签内部意见.useless
function showXmlOpinionHQInner(ideaDiv,zqyjXML,divShow,columnName,type){

	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	
	var resulting = pagesource.transformNode(style);
	
	if(resulting!=""){
		LoadOpinionXmlHQInner(divShow,resulting);
	}

}
//useless
function LoadOpinionXmlHQInner(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	
	var tablehead = "<table width=90% border=0 align=center type=margin:5px;margin-top:50px;>";
	var tableend = "</table>";
	
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
			  }   
		      //意见内容     
		      if(signidea!="" && signidea!=="%@##@%;"){
		     	 SignIdeaTR = "<tr><td style=line-height:100%;height:18px;font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:14pt;>"+blankstr+signidea+"</td></tr>";
			 }
		     //附件链接
		      if(curAttachFinally!=""){
		    		 SignIdeaTR = SignIdeaTR+ "<tr><td><table width=90% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空可能由上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept&&signidea!=""){
				AttachTR="";
			}
			//只在同一部门的第一个意见下显示部门上传附件信息
			if(deptframe_receiver==LastDepartment&&signidea!=""){
				AttachTR="";
			}
			if(signidea!=""){	 
		     		SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 	//意见表格中落款日期时间
		     	 	if(signedtime!=""){
					SignNameAndTimeTR = "<tr>";
					SignNameAndTimeTR = SignNameAndTimeTR + "<td style=line-height:100%;height:18px;font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:14pt;><div align=right>"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"</div></td>";
					SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 	}
		
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				}else if(deptframe_receiver==LastDepartment){
					TmpTableTR= TmpTableTR +SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR +SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}
				LastDepartment=deptframe_receiver;	//记录上一意见的部门	
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}

}






//隐藏部门的意见
function showXmlOpinionNoDept(ideaDiv,zqyjXML,divShow,columnName,type){
	//if(ideaDiv!="divXML_SHidea")return false;
	//alert(E("divXML_SHidea").innerHTML);
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	//alert(XMLOpinion);
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}	
	
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	//alert(XMLOpinion.xml);
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	XMLOpinion = XMLOpinion.replace(/<CDATA>/gi,"<![cdata[");
	XMLOpinion = XMLOpinion.replace(/<cdata>/gi,"<![cdata[");
	XMLOpinion = XMLOpinion.replace(/<\/CDATA>/gi,"]]>");
	XMLOpinion = XMLOpinion.replace(/<\/cdata>/gi,"]]>");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	//alert(XMLOpinion);
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	
	var resulting = pagesource.transformNode(style);
	//alert(resulting)
	if(resulting!=""){
		LoadOpinionXmlNoDept(divShow,resulting);
	}
}


/*
  功能： 按时间降序显示XML意见
	add by ysw 0805
*/
function LoadOpinionXmlNoDept(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
		       
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
			  //	alert(tmpNode.xml);
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
			  //alert(signidea)
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 //alert(tmpAttach)
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");	
				 }     
				 curAttachFinally = tmpAttach;
				 //alert(curAttachFinally)
			  }   
		      //意见内容     
		      if(signidea!="" && signidea!=="%@##@%;"){
		     	 SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+signidea+"</td></tr>";
			 }
		     //附件链接
		      if(curAttachFinally!=""){
		    		 SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
					 //alert(SignIdeaTR)
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}
//alert("signidea="+signidea);
			if(signidea!=""){	 

		     		SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 	//意见表格中落款日期时间
		     	 	if(signedtime!=""){
					SignNameAndTimeTR = "<tr>";
					SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;text-align:right;>"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"</td>";
					SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 	}
				
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				}else if(firstdepart_receiver==LastDepartment){
					TmpTableTR= TmpTableTR +SignIdeaTR + AttachTR + SignNameAndTimeTR;
					//TmpTableTR= TmpTableTR +SignIdeaTR + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR +SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  



//useless
function showXmlOpinion(ideaDiv,zqyjXML,divShow,columnName,type){
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	
	var resulting = pagesource.transformNode(style);
	
	if(resulting!=""){
		LoadOpinionXml(divShow,resulting);
	}
}


/*
  功能： 按时间降序显示XML意见,useless
	add by ysw 0805
*/
function LoadOpinionXml(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
			  }   
		      //意见内容     
		      if(signidea!="" && signidea!=="%@##@%;"){
		     	 SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+signidea+"</td></tr>";
			 }
			 
		     //附件链接
		      if(curAttachFinally!=""){
		    		 SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}

			if(signidea!=""){	 
			  	if(firstdepart_receiver!=""){
		       	 	 SignIdeaDeptTR = SignIdeaDeptTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+firstdepart_receiver+"</td>";
		      	}else{
		        		 SignIdeaDeptTR = SignIdeaDeptTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+department_receiver+"</td>";
		     	}
		     	SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 //意见表格中落款日期时间
		     	 if(signedtime!=""){
		     		 SignNameAndTimeTR = "<tr>";
		     		 SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;text-align:right;>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		 SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 }
		
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				}else if(firstdepart_receiver==LastDepartment){
					TmpTableTR= TmpTableTR +SignIdeaTR + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR +SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				//替换回换行字符
				//TmpTableTR = TmpTableTR.replace("$#@@#$","<br>");
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  



/*
  功能： 按行领导顺序显示XML意见
  add by ysw 0805
*/
function LoadOpinionXmlByLd(ideaDiv,ldList,divShow){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"

	
	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	
	if(XMLOpinion=="")	return false;
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	//alert(XMLOpinion);
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	var OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null || XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	
	var deptList =new Array();
	var deptNoList=new Array();
	var firstDeptList =new Array();
	var firstDeptNoList=new Array();
	var cNameList =new Array();
	var ideaList=new Array();
	var timeList =new Array();
	var warrantList=new Array();
	var itemId=new Array();
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
	   tmpNode = OpiniondocEle.childNodes[i];
	   if (tmpNode) {
			var SignIdeaTR="";
			var SignNameAndTimeTR="";
			var id=tmpNode.getAttribute("name");
			//意见落款人当前部门
			var department_receiver =""
			if(tmpNode.selectSingleNode("item[@name='department_receiver']")){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text; 
			}
			//意见落款人当前部门编号
		       var department_deptno =""
			if(tmpNode.selectSingleNode("item[@name='department_deptno']")){
				department_deptno =tmpNode.selectSingleNode("item[@name='department_deptno']").text;
			} 
		        //意见落款人一级部门
		       var firstdepart_receiver =""
			if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")){
				firstdepart_receiver =tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			} 
		        //意见落款人一级部门编号
		       var firstdepart_deptno =""
			if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")){
				firstdepart_deptno =tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			} 
		        //意见落款人中文名
		       var chinesename_receiver =""
			if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")){
				chinesename_receiver =tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			} 
		        //落款意见
		       var signidea =""
			if(tmpNode.selectSingleNode("item[@name='signidea']")){
				signidea =tmpNode.selectSingleNode("item[@name='signidea']").text;
			} 
		        //落款时间
		       var signedtime =""
			if(tmpNode.selectSingleNode("item[@name='signedtime']")){
				signedtime =tmpNode.selectSingleNode("item[@name='signedtime']").text;
			} 
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold =""
			if(tmpNode.selectSingleNode("item[@name='warrantstrold']")){
				warrantstrold =tmpNode.selectSingleNode("item[@name='warrantstrold']").text;    
			}   
		       
		       //将信息存放在数组中，再对数组排序
		       deptList.push(department_receiver);
		       deptNoList.push(department_deptno);
		       firstDeptList.push(firstdepart_receiver);
		       firstDeptNoList.push(firstdepart_deptno);
		       cNameList.push(chinesename_receiver);
		       ideaList.push(signidea);
		       timeList.push(signedtime);
		       warrantList.push(warrantstrold);
		       itemId.push(id);
	     }
	}
	//indexList数组记录部门编号从小到大排序的数组下标
	var indexList=new Array();
	//记录数组下标，根据行领导顺序
	for(var a=0;a<ldList.length;a++){
		for(var b=0;b<cNameList.length;b++){
			if(ldList[a].replace(/ /gi,"")==cNameList[b].replace(/ /gi,"")){
				indexList.push(b);	
			}
		}
	}
	
	//如不是行领导，则放在后面
	for(var s=0;s<cNameList.length;s++){
		var flag=false;
		for(var t=0;t<indexList.length;t++){
			if(indexList[t]==s){
				flag=true;
				break;
			}
		}
		if(flag==false)indexList.push(s);
	}
	
	var editedIdeaFields="";
	var NodeSpecialAttribute="";
	if(document.all("editedIdeaFields")){
		editedIdeaFields = document.all("editedIdeaFields").value; //可编辑意见域值
	}
	if(document.all("NodeSpecialAttribute")){
		NodeSpecialAttribute = document.all("NodeSpecialAttribute").value; //取得环节属性
	}
	editedIdeaFields = editedIdeaFields.replace(/ /gi, ""); //去掉空格
	NodeSpecialAttribute = NodeSpecialAttribute.replace(/ /gi, ""); //去掉空格
	var isxg=NodeSpecialAttribute.indexOf("ModifySelfIdea");  //是否可修改意见
	var editflag = location.href.toLowerCase().indexOf("?editdocument");
	var isgwname = document.all("curUserGW").value.indexOf("bankleaderG"); //取得当前人是否有行签发岗位
	var cnname = document.all("curhandlercname").value;
	var tempyj="";    //记录行领导可以编辑的旧意见,格式"意见@@部门##姓名$$时间"
	//alert(1111);
	for(var t=0;t<indexList.length;t++){
		var a=indexList[t];
	
		//意见内容

		SignIdeaTr = "<tr>";
		SignIdeaTr = SignIdeaTr+ "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+ideaList[a]+"</td>";
		SignIdeaTr = SignIdeaTr+ "</tr>";
              if (ideaList[a]=="%@##@%;")
                    SignIdeaTr="";
		SignNameAndTimeTR="";
	
		//意见表格中落款人部门名和中文名组合
		if(warrantList[a]!=""){
			chinesename_receiver=cNameList[a]+warrantList[a]; //记录代理人信息   
		}else{
			chinesename_receiver=cNameList[a];
		}
		//意见表格中落款日期时间     
		SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;><div align=right>"+chinesename_receiver+"&nbsp&nbsp&nbsp";
		SignedTimeTR = "<tr>";
		SignNameAndTimeTR = SignNameAndTimeTR +timeList[a]+blankstr+"</div></td>";
		SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
	       
		if(TmpTableTR==""){
			TmpTableTR= SignIdeaTr + SignNameAndTimeTR;
		}else{
			TmpTableTR= TmpTableTR + SignIdeaTr + SignNameAndTimeTR;
		}
	}
	if(document.all.fld_tempyj){
		document.all.fld_tempyj.value=tempyj;
	}
	//TmpTableTR = TmpTableTR.replace("$#@@#$","<br>");
	TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
	TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
	E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
}



//===========================退回意见:点击展开关闭效果====================================

function openShutManager(obj,id){

	var arrlist = new Array();
	var bhidea = showbhidea();

	if(id!="box"){
		arrlist[0] = new Array(bhidea);
	}else{
		var oldfile = showoldfiles();
		arrlist[0] = new Array(oldfile);
	}	
	//函数在sursen.js外部文件中

	showmenu(obj,arrlist)
	return false;
}


function showbhidea(){
try{
	//环节信息
	J_BackNodes=$("TakeBackNode").value;
	J_BacktTos =$("TakeBackToNode").value;
	if(J_BackNodes && J_BacktTos){
		//处理人信息
		J_BankToPer =""
		if($("TakeBackToPer")){
			J_BankToPer =$("TakeBackToPer").value;
		} 
		J_BankDealPer =""
		if($("TakeBackDealPer")){
			J_BankDealPer =$("TakeBackDealPer").value;
		}
		var openuser = $("openUser").value;
	}else{
		return 0
	}


	var BackPerList = J_BankDealPer.split(";");
	var BackToPerList  = J_BankToPer.split(";");
	var BackNodeList = J_BackNodes.split(";");
	var BackToList = J_BacktTos.split(";");
	var BackNodeIdea=E("divXML_BHidea").innerHTML;
	
	if(BackNodeIdea=="")	return false;
	//将XML意见加上头尾
	var BackNodeIdea="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+BackNodeIdea+"</ideaitems>";
	//BackNodeIdea=BackNodeIdea.toLowerCase()
	//避免把意见中的大写也转换为小写
	BackNodeIdea=BackNodeIdea.replace(/<IDEAITEM/gi,"<ideaitem")
	BackNodeIdea=BackNodeIdea.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	BackNodeIdea=BackNodeIdea.replace(/<ITEM/gi,"<item")
	BackNodeIdea=BackNodeIdea.replace(/<\/ITEM>/gi,"</item>")

	BackNodeIdea=BackNodeIdea.replace(/&lt;/g,"<");
	BackNodeIdea = BackNodeIdea.replace(/&gt;/g,">");
	BackNodeIdea = BackNodeIdea.replace(/<BR>/g,"");
	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	XMLOpinionDoc.loadXML(BackNodeIdea);
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
	   return false;
	}

	var BackInfoList=new Array()
	var len=0
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
			var PerBackInfo=""
		        //意见落款人当前部门
			var department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			if(department_receiver.indexOf(";")){		//如果是多部门(临时处理)
				department_receiver=department_receiver.substr(0,department_receiver.indexOf(";"))
			}
		        //意见落款人当前部门编号
			var department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		        //意见落款人一级部门
			var firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			if(firstdepart_receiver.indexOf(";")){		//如果是多部门(临时处理)
				firstdepart_receiver=firstdepart_receiver.substr(0,firstdepart_receiver.indexOf(";"))
			}
		        //意见落款人一级部门编号
			var firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
		        //意见落款人中文名
			var chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
		        //落款意见
			var signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
		        //落款时间
			var signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
		        //代理人信息
			var warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			
			signedtime=DealDateStr(signedtime)
			PerBackInfo="<td width=25% style=font-family:宋体;font-size:11pt;text-align:left;>"+signidea+"</td>"
			PerBackInfo+="<td width=25% style=font-family:宋体;font-size:11pt;text-align:center;>"+signedtime+"</td>"

			BackInfoList[len]=PerBackInfo
			len++
		}
	}    

	var tempsresult="";
	for(var j=0;j<BackNodeList.length;j++){
		if(BackNodeList[j]=="" ||(BackPerList[j]!=openuser && BackToPerList[j]!=openuser)){
			continue;
		}
		BackInfoList[j] = BackInfoList[j].replace(/%@##@%;/gi,"&nbsp;");
		BackInfoList[j] = BackInfoList[j].replace(/%#@@#%/gi,"<br>");
		var BackPerListCN=getCNByEN(BackPerList[j])
		var BackPerToListCN=getCNByEN(BackToPerList[j])

		var backnode="<td width=25% style=font-family:宋体;font-size:11pt;text-align:center;>"+BackNodeList[j]+"<br>("+BackPerListCN+")"+"</td>";
		var tonode = "<td width=25% style=font-family:宋体;font-size:11pt;text-align:center;>"+BackToList[j]+"<br>("+BackPerToListCN+")"+"</td>";
	
		if(tempsresult==""){
			tempsresult ="<tr class=biao-bg>"+ backnode + tonode + BackInfoList[j] +"</tr>"
		}else{
			tempsresult = tempsresult +"<tr class=biao-bg>"+ backnode + tonode + BackInfoList[j] +"</tr>"
		}
	}
	var tablehead ="<table width=\"100%\" height=\"25\" border=\"0\" align=\"center\" cellspacing=\"1\" class=\"biankuang\" >"
	        +"<tr class=\"biaotou\">" 
	        +"<td width=25%>执行环节</td>"
		   +"<td width=25%>退回环节</td>"
	        +"<td width=25%>退回说明</td>"
	        +"<td width=25%>退回时间</td>"
	        +"</tr>"
	var tableend="</table>"
	tempsresult = tablehead+tempsresult+tableend

	return tempsresult;
}catch(err){
	alert("外部文件中函数showbhidea出错!"+err.number+" : "+err.description)
	return ""
}
}
function getCNByEN(EN){
//根据用户EN,返回用户CN
	var CN="";
	EN=EN.replace(/CN=/gi,"")
	EN=EN.replace(/OU=/gi,"")
	EN=EN.replace(/O=/gi,"")
	var filepath=document.all("filepath")
	if(filepath)
		filepath=filepath.value
	if(filepath=="")	return ""
	var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLDoc.async = false;
	var StrViewURL = "/"+filepath+"/org.nsf/peopleFullAbbName?readViewEntries&restricttocategory="+EN;
	XMLDoc.load(StrViewURL);
	//window.open(StrViewURL)
	strselect="//viewentry/entrydata[@name='ChineseName']";
	entryNodes=XMLDoc.selectNodes(strselect);
	if(entryNodes && entryNodes.length>0){
		CN=entryNodes[0].text;
	}
	return CN;
}

function getAbsoluteHeight(ob){
	return ob.offsetHeight
}
function getAbsoluteWidth(ob){
	return ob.offsetWidth
}
function getAbsoluteLeft(ob){
	var s_el=0;el=ob;
	while(el){
		s_el=s_el+el.offsetLeft;
		el=el.offsetParent;
	}; 
	return s_el
}
function getAbsoluteTop(ob){
	var s_el=0;
	el=ob;
	while(el){
		s_el=s_el+el.offsetTop ;
		el=el.offsetParent;
	}; 
	return s_el
}



//查看退回意见时显示下拉菜单
function showmenu(objInputId,arrlist){

	var divstytl=" #menu {width:620px;} #menu a { width:510px; display:block;";
	divstytl+=" border:1px solid #ddd; background-color:#fafafa;";
	divstytl+=" padding:2px; margin:3px 1px; text-decoration:none;}";
	divstytl+=" #menu  a:hover {background-color:#ccc;} ";
	if(document.all.menubh){
	
	}else{
		var mydiv=document.createElement("div");
		mydiv.setAttribute("id","menubh");
		mydiv.style.display="inline";
		mydiv.style.position="absolute";
		mydiv.style.cursor="default";
		mydiv.style.zIndex=2;
		document.body.appendChild(mydiv);
	    
		var mystyle = document.createElement("style");
		mystyle.type="text/css";
		if(mystyle.styleSheet){
			mystyle.styleSheet.cssText=divstytl;
		}else{
			css = document.createTextNode(divstytl);
			mystyle.appendChild(divstytl);
		}
	
		var myiframe = document.createElement("iframe");
		myiframe.style.cssText="position: absolute; top:0px; left:0px; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';";
		myiframe.style.display="none"; 
		myiframe.style.zIndex=1;
		myiframe.setAttribute("id","myiframe1");
	   
		document.body.appendChild(mystyle);
		document.body.appendChild(mydiv);
		document.body.appendChild(myiframe);
	}
	
	var objouter=E("menubh") //显示的DIV对象
	var objiframe=E("myiframe1") //显示的iframe对象
	
	objouter.style.display='inline';
	objiframe.style.display="inline"; 
	
	var objInput = objInputId; //对象  
	
	var divhtml="";
	for (var i=0;i<arrlist.length;i++){
		divhtml+=arrlist[i]
	}
	objouter.innerHTML=divhtml;
	//alert(divhtml);
	divPosition();
	//alert();
	//objouter.onmouseleave=divhide
	objouter.onmouseout=divhide
	
	function divhide(){
		if(objouter)
			objouter.style.display='none';
		if(objiframe)
			objiframe.style.display='none';
		return false;
	}
	function divPosition(){
		objouter.style.top =getAbsoluteHeight(objInput)+getAbsoluteTop(objInput);
		var originy0 = screen.availHeight / 2 - 100;  //取屏幕高度中值-200
		objiframe.style.top=objouter.style.top
		if(parseInt(objouter.style.top)>parseInt(originy0)){
		objouter.style.top = parseInt(objouter.style.top)-33*arrlist.length
	}
	
	objouter.style.left =getAbsoluteLeft(objInput); 
	objiframe.style.left=objouter.style.left
	
	objouter.style.width=700;
	objiframe.style.width=objouter.style.width
	objiframe.style.height=29 * arrlist.length
	}
}







//useless
function openShutManager_bak(obj,id){

	var arrlist = new Array(2);
	var bhidea = showbhidea();

	if(id!="box"){
		arrlist[0] = new Array(bhidea);
	}else{
		var oldfile = showoldfiles();
		arrlist[0] = new Array(oldfile);
	}	
	//函数在sursen.js外部文件中

	showmenu(obj,arrlist)
	return false;
}

//useless
function showbhidea_bak(){
try{
	J_BackNodes=$("TakeBackNode").value;
	
	if(J_BackNodes==""){
		return false;
	}
	J_BacktTos =$("TakeBackToNode").value;
	
	var openuser = $("openUser").value;

	J_BankToPer =""
	if($("TakeBackToPer")){
		J_BankToPer =$("TakeBackToPer").value;
	} 
	J_BankDealPer =""
	if($("TakeBackDealPer")){
		J_BankDealPer =$("TakeBackDealPer").value;
	}

	var BackPerList = J_BankDealPer.split(";");
	var BackToPerList  = J_BankToPer.split(";");
	var BackNodeList = J_BackNodes.split(";");
	var BackToList = J_BacktTos.split(";");
	var BackNodeIdea=E("divXML_BHidea").innerHTML;
	
	if(BackNodeIdea=="")	return false;
	//将XML意见加上头尾
	var BackNodeIdea="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+BackNodeIdea+"</ideaitems>";
	//BackNodeIdea=BackNodeIdea.toLowerCase()
	//避免把意见中的大写也转换为小写
	BackNodeIdea=BackNodeIdea.replace(/<IDEAITEM/gi,"<ideaitem")
	BackNodeIdea=BackNodeIdea.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	BackNodeIdea=BackNodeIdea.replace(/<ITEM/gi,"<item")
	BackNodeIdea=BackNodeIdea.replace(/<\/ITEM>/gi,"</item>")

	BackNodeIdea=BackNodeIdea.replace(/&lt;/g,"<");
	BackNodeIdea = BackNodeIdea.replace(/&gt;/g,">");
	BackNodeIdea = BackNodeIdea.replace(/<BR>/g,"");
	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	XMLOpinionDoc.loadXML(BackNodeIdea);
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
	   return false;
	}
	
	var tablehead = "<table width='100%' border='0'>";
	var tableend = "</table>";
	var TmpTableTR="";
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
			var SignIdeaTR="";
			var SignIdeaDeptTR="";
			var SignNameAndTimeTR="";
	      
		        //意见落款人当前部门
			var department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			if(department_receiver.indexOf(";")){		//如果是多部门(临时处理)
				department_receiver=department_receiver.substr(0,department_receiver.indexOf(";"))
			}
		        //意见落款人当前部门编号
			var department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		        //意见落款人一级部门
			var firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			if(firstdepart_receiver.indexOf(";")){		//如果是多部门(临时处理)
				firstdepart_receiver=firstdepart_receiver.substr(0,firstdepart_receiver.indexOf(";"))
			}
		        //意见落款人一级部门编号
			var firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
		        //意见落款人中文名
			var chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
		        //落款意见
			var signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
		        //落款时间
			var signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  //落款时间处理(不要年份和时间,字号小)
			  if(signedtime.indexOf(" ")!=-1 && signedtime.split(" ").length==2){
				var datestr=signedtime.split(" ")[0]
				if(datestr.indexOf("-")!=-1 && datestr.split("-").length==3){
					signedtime="<font size=3>"+datestr.split("-")[1]+"-"+datestr.split("-")[2]+"</font>"
				}
			  }
		        //代理人信息
			var warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			if(signidea!=""){   
			      //意见内容
			      SignIdeaTr = "<tr>";
			      SignIdeaTr = SignIdeaTr+ "<td>&nbsp&nbsp&nbsp&nbsp"+signidea+"</td>";
			      SignIdeaTr = SignIdeaTr+ "</tr>";
	                    if (signidea=="%@##@%;")
                                SignIdeaTr="";
			      //意见表格中落款人部门名和中文名组合
			      SignIdeaDeptTR = "<tr>";
			      if(warrantstrold!="")	chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			      if(department_receiver==""){
					SignIdeaDeptTR = SignIdeaDeptTR + "<td>"+firstdepart_receiver+"</td>";
			      }else{
					SignIdeaDeptTR = SignIdeaDeptTR + "<td>"+department_receiver+"</td>";
			      }
			      SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
	      
			      //意见表格中落款日期时间
			      SignNameAndTimeTR = "<tr>";
			      SignNameAndTimeTR = SignNameAndTimeTR + "<td><div align=right>"+chinesename_receiver+"&nbsp&nbsp"+signedtime+"&nbsp&nbsp&nbsp&nbsp</div></td>";
			      SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
	       
				if(TmpTableTR==""){
					TmpTableTR= SignIdeaDeptTR + SignIdeaTr + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR +"%#%"+ SignIdeaDeptTR + SignIdeaTr + SignNameAndTimeTR;
				}
	      
			}else{
		      	var tempstr="<tr><td></td></tr>"
		      	if(TmpTableTR==""){
		         		TmpTableTR= tempstr;
		      	}else{
		         		TmpTableTR= TmpTableTR +"%#%"+ tempstr;
		      	}	
			}
		}
	}    

	var backideaList = TmpTableTR.split("%#%");
	
	var tempsresult="";
	var temptr="<tr class='biao-bg'>";
	var tempendtr="</tr>";
	for(var j=0;j<BackNodeList.length;j++){
		if(BackNodeList[j]=="" ||(BackPerList[j]!=openuser && BackToPerList[j]!=openuser)){
			continue;
		}
		backideaList[j] = backideaList[j].replace(/%@##@%;/gi,"&nbsp;");
		backideaList[j] = backideaList[j].replace(/%#@@#%/gi,"<br>");
		var backnode="<td align='center' width='20%'>"+BackNodeList[j]+"</td>";
		var tonode = "<td align='center'>"+BackToList[j]+"</td>";
		var backidea="<td>"+tablehead+backideaList[j]+tableend+"</td>";
	
		if(tempsresult==""){
			tempsresult =temptr+backnode+tonode+backidea+tempendtr;
		}else{
			tempsresult = tempsresult+temptr+backnode+tonode+backidea+tempendtr;
		}
	}
	var tablehead ="<table width=\"100%\" height=\"25\" border=\"0\" align=\"center\" cellspacing=\"1\" class=\"biankuang\" >"
	        +"<tr class=\"biaotou\">" 
	        +"<td align=\"center\" width=\"20%\">执行返回的环节</td>"
		   +"<td align=\"center\" width=\"20%\">返回到环节</td>"
	        +"<td align=\"center\">返回说明</td>"
	        +"</tr>"
	var tableend="</table>"
	tempsresult = tablehead+tempsresult+tableend
	return tempsresult;
}catch(err){
	alert("外部文件中函数showbhidea出错!"+err.number+" : "+err.description)
	return ""
}
}

//查看退回意见时显示下拉菜单,useless
function showmenu_bak(objInputId,arrlist){

	var divstytl=" #menu {width:620px;} #menu a { width:510px; display:block;";
	divstytl+=" border:1px solid #ddd; background-color:#fafafa;";
	divstytl+=" padding:2px; margin:3px 1px; text-decoration:none;}";
	divstytl+=" #menu  a:hover {background-color:#ccc;} ";
	if(document.all.menubh){
	
	}else{
		var mydiv=document.createElement("div");
		mydiv.setAttribute("id","menubh");
		mydiv.style.display="inline";
		mydiv.style.position="absolute";
		mydiv.style.cursor="default";
		mydiv.style.zIndex=2;
		document.body.appendChild(mydiv);
	    
		var mystyle = document.createElement("style");
		mystyle.type="text/css";
		if(mystyle.styleSheet){
			mystyle.styleSheet.cssText=divstytl;
		}else{
			css = document.createTextNode(divstytl);
			mystyle.appendChild(divstytl);
		}
	
		var myiframe = document.createElement("iframe");
		myiframe.style.cssText="position: absolute; top:0px; left:0px; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';";
		myiframe.style.display="none"; 
		myiframe.style.zIndex=1;
		myiframe.setAttribute("id","myiframe1");
	   
		document.body.appendChild(mystyle);
		document.body.appendChild(mydiv);
		document.body.appendChild(myiframe);
	}
	
	var objouter=E("menubh") //显示的DIV对象
	var objiframe=E("myiframe1") //显示的iframe对象
	
	objouter.style.display='inline';
	objiframe.style.display="inline"; 
	
	var objInput = objInputId; //对象  
	
	var divhtml="";
	for (var i=0;i<arrlist.length;i++){
		divhtml+=arrlist[i]
	}
	objouter.innerHTML=divhtml;
	
	divPosition();
	objouter.onmouseleave=divhide
	
	function divhide(){
		if(objouter)
			objouter.style.display='none';
		if(objiframe)
			objiframe.style.display='none';
		return false;
	}
	function divPosition(){
		objouter.style.top =getAbsoluteHeight(objInput)+getAbsoluteTop(objInput);
		var originy0 = screen.availHeight / 2 - 100;  //取屏幕高度中值-200
		objiframe.style.top=objouter.style.top
		if(parseInt(objouter.style.top)>parseInt(originy0)){
		objouter.style.top = parseInt(objouter.style.top)-33*arrlist.length
	}
	
	objouter.style.left =getAbsoluteLeft(objInput); 
	objiframe.style.left=objouter.style.left
	
	objouter.style.width=500;
	objiframe.style.width=objouter.style.width
	objiframe.style.height=29 * arrlist.length
	}
}



function LoadOpinionXmlAndModify(ideaDiv,divShow){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinion =""
	if(document.all(ideaDiv)){
		XMLOpinion=document.all(ideaDiv).innerHTML;
	}
	if(XMLOpinion==""){
		return false;
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	if (OpiniondocEle == null || XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var editedIdeaFields = document.all("editedIdeaFields").value; //可编辑意见域值
	var NodeSpecialAttribute = document.all("NodeSpecialAttribute").value; //取得环节属性
	editedIdeaFields = editedIdeaFields.replace(/ /gi, ""); //去掉空格
	NodeSpecialAttribute = NodeSpecialAttribute.replace(/ /gi, ""); //去掉空格
	var isxg=NodeSpecialAttribute.indexOf("ModifySelfIdea");  //是否可修改意见
	var editflag = location.href.toLowerCase().indexOf("?editdocument");
	var cnname = document.all("curhandlercname").value;
	var tablehead = "<table width=90% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
		if (tmpNode) {
			var SignIdeaTR="";
	      	var SignedNameAndTimeTR="";
	      	var id=tmpNode.getAttribute("name");
	        //意见落款人当前部门
	       	var department_receiver =""
			if(tmpNode.selectSingleNode("item[@name='department_receiver']")){
				department_receiver =tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			} 
	        //意见落款人当前部门编号
	       	var department_deptno =""
			if(tmpNode.selectSingleNode("item[@name='department_deptno']")){
				 department_deptno =tmpNode.selectSingleNode("item[@name='department_deptno']").text;
			}
	        //意见落款人一级部门
	       	var firstdepart_receiver =""
			if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")){
				firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			}
	        //意见落款人一级部门编号
	       	var firstdepart_deptno =""
			if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")){
				firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			}
	        //意见落款人中文名
	       	var chinesename_receiver =""
			if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")){
				chinesename_receiver =tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			} 
	        //落款意见
	       	var signidea =""
			if(tmpNode.selectSingleNode("item[@name='signidea']")){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			}
	        //落款时间
	       	var signedtime =""
			if(tmpNode.selectSingleNode("item[@name='signedtime']")){
				signedtime =tmpNode.selectSingleNode("item[@name='signedtime']").text;
			} 
			 signedtime=DealDateStr(signedtime)
	        	//代理人信息
	       	var warrantstrold =""
			if(tmpNode.selectSingleNode("item[@name='warrantstrold']")){
				warrantstrold =tmpNode.selectSingleNode("item[@name='warrantstrold']").text;    
			}			
	      	//意见内容
	      	SignIdeaTr = "<tr>";
	       	if (((editflag != -1) && (cnname == chinesename_receiver) && (isxg != -1))){ //当前环节可以修改历史意见,并只在编辑状态下
	      		SignIdeaTr = SignIdeaTr+ "<td><textarea name=\"tempyjs\" id=\""+id+"\" rows=2 cols=50 class=form1>&nbsp&nbsp&nbsp&nbsp"+signidea+"</textarea></td>";
	      	}else{
	      		SignIdeaTr = SignIdeaTr+ "<td>"+blankstr+signidea+"</td>";
	      	}
	      	SignIdeaTr = SignIdeaTr+ "</tr>";
	      
		      //意见表格中落款署名和日期时间
			SignedTimeTR = "<tr>";
			if(((editflag != -1) && (cnname == chinesename_receiver) && (isxg != -1))) { //当前环节可以修改历史意见,并只在编辑状态下
				SignedTimeTR = SignedTimeTR + "<td><textarea name=\"tempyjs_time\" rows=1 cols=50 class=form1>"+chinesename_receiver+"  "+signedtime+"     </textarea></td>";
			}else{
				SignedTimeTR = SignedTimeTR + "<td><div align=right>"+chinesename_receiver+"&nbsp&nbsp&nbsp"+signedtime+blankstr+"</div></td>";
			}
			SignedTimeTR = SignedTimeTR + "</tr>";
			if(TmpTableTR==""){
				TmpTableTR= SignIdeaTr + SignedTimeTR;
			}else{
				TmpTableTR= TmpTableTR + SignIdeaTr + SignedTimeTR;
			}
		}
	}
	E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
}    


/*****************************************************************************************************************************************/







//先检测行领导是否修改旧意见,如修改了旧意见，则将旧意见备份，将修改的意见组合成XML放在原意见域中。
//fieldName对应存放XML意见域，如QFidea_1;divShow为XML意见展示DIV
//add by ysw 0805
function saveLdyj(fieldName,divShow){
var xmlOpinion=document.all(fieldName).value;
var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
XMLOpinionDoc.async = false;
xmlOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+xmlOpinion+"</ideaitems>";
//xmlOpinion=xmlOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	xmlOpinion=xmlOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	xmlOpinion=xmlOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	xmlOpinion=xmlOpinion.replace(/<ITEM/gi,"<item")
	xmlOpinion=xmlOpinion.replace(/<\/ITEM>/gi,"</item>")

var qfyjs=document.all.qfyjs;
var qfyjs_ry=document.all.qfyjs_ry;
var qfyjs_time=document.all.qfyjs_time;
var tempYj="";
var deptname="";
var cnName="";
var sTime=""
var fld_tempyj=document.all.fld_tempyj.value;
if(qfyjs){
if(qfyjs.length){
	for(var i=0;i<qfyjs.length;i++){
		if(qfyjs[i].value=="")continue;
		if(qfyjs_ry[i]){		
		qfyjs_ry_tmp=moveQmkg(qfyjs_ry[i].value);//去掉将字符串qfyjs_yj[i].value中前面空格
		var index=qfyjs_ry_tmp.indexOf(" ");
		//alert("qfyjs_ry_tmp="+qfyjs_ry_tmp+"  index="+index+" i="+i);
		if(index==-1)index=0;
		var signidea=qfyjs[i].value;
		var deptname=qfyjs_ry_tmp.substring(0,index);
		var cnName=qfyjs_ry_tmp.substr(index+1);
		deptname=deptname.replace(/ /g,"");
		cnName=cnName.replace(/ /g,"");		
		}
		if(qfyjs_time[i]){
		sTime=qfyjs_time[i].value;
		}
		var id=qfyjs[i].id;
		tempYj=signidea+"@@"+deptname+"##"+cnName+"$$"+sTime;
		//没找到表示已修改
		if(fld_tempyj.indexOf(tempYj)==-1){
		//alert("1="+xmlOpinion);
		var xmlList=replaceXmlOpinion(xmlOpinion,id,signidea,deptname,cnName,sTime);
		xmlOpinion=xmlList[0];	//取旧意见
		document.all.fld_backupyj.value=document.all.fld_backupyj.value+xmlList[1];	//将旧意见备份		
		}	
	}
}
else{	//else条件为只有一条可编辑意见
	if(qfyjs!=""){
	qfyjs_ry_tmp=moveQmkg(qfyjs_ry.value);//去掉将字符串qfyjs_yj[i].value中前面空格
	var index=qfyjs_ry_tmp.indexOf(" ");
	//alert("qfyjs_ry_tmp="+qfyjs_ry_tmp+"  index="+index+" i="+i);
	if(index==-1)index=0;
	var signidea=qfyjs.value;
	var deptname=qfyjs_ry_tmp.substring(0,index);
	var cnName=qfyjs_ry_tmp.substr(index+1);
	deptname=deptname.replace(/ /g,"");
	cnName=cnName.replace(/ /g,"");
	var sTime=qfyjs_time.value;
	var id=qfyjs.id;
	tempYj=signidea+"@@"+deptname+"##"+cnName+"$$"+sTime;
	//没找到表示已修改
	if(fld_tempyj.indexOf(tempYj)==-1){
	var xmlList=replaceXmlOpinion(xmlOpinion,id,signidea,deptname,cnName,sTime);
	xmlOpinion=xmlList[0];	//取旧意见
	document.all.fld_backupyj.value=document.all.fld_backupyj.value+xmlList[1];	//将旧意见备份
	//alert("modOpinion="+xmlOpinion);
	}
	}
}
}
//document.all.fld_backupyj.value=document.all.fld_backupyj.value+document.all(fieldName).value;
XMLOpinionDoc.loadXML(xmlOpinion);		//装载XML信息
OpiniondocEle = XMLOpinionDoc.documentElement;
var itemsNode=OpiniondocEle.selectNodes("//ideaitems/ideaitem");
var newOpinionXml="";
for(i=0;i<itemsNode.length;i++){
newOpinionXml=newOpinionXml+itemsNode[i].xml;
}
if(newOpinionXml!="")
document.all(fieldName).value=newOpinionXml;	//将新组合的XML存放在意见域中
//alert(newOpinionXml);
}



//替换XML节点，将修改意见组合成XML节点，替换旧节点。关联关系为意见域id与ideaitem节点的name属性相同.
//add by ysw 0805
function replaceXmlOpinion(xmlOpinion,id,signidea,deptname,cnName,sTime){
var xmlList=new Array(1);
var oldOpinionXml="";
//var department_deptno=getDeptNoByDeptName(deptname);
var department_deptno="";
//alert("department_deptno="+department_deptno);

//alert("opinionXml="+opinionXml);
var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
XMLOpinionDoc.async = false;
XMLOpinionDoc.loadXML(xmlOpinion);		//装载XML信息
OpiniondocEle = XMLOpinionDoc.documentElement;
var ItemNode=OpiniondocEle.selectSingleNode("//ideaitems/ideaitem[@name='"+id+"']");

var oFragment=XMLOpinionDoc.createDocumentFragment();
//创建部门节点
 var oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "department_receiver");
 var oText=XMLOpinionDoc.createTextNode(deptname);
 oP.appendChild(oText);
 oFragment.appendChild(oP);
 //创建部门编号节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "department_deptno");
 oText=XMLOpinionDoc.createTextNode(department_deptno);
 oP.appendChild(oText);
 oFragment.appendChild(oP);
 //创建一级部门节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "firstdepart_receiver");
 oText=XMLOpinionDoc.createTextNode("");
 oP.appendChild(oText);
 oFragment.appendChild(oP);
 //创建一级部门编号节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "firstdepart_deptno");
 oText=XMLOpinionDoc.createTextNode("");
 oP.appendChild(oText);
 oFragment.appendChild(oP);
 //创建姓名节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "chinesename_receiver");
 oText=XMLOpinionDoc.createTextNode(cnName);
 oP.appendChild(oText);
 oFragment.appendChild(oP);
 //创建意见节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "signidea");
 oText=XMLOpinionDoc.createTextNode(signidea);
 oP.appendChild(oText);
 oFragment.appendChild(oP);
  //创建时间节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "signedtime");
 oText=XMLOpinionDoc.createTextNode(sTime);
 oP.appendChild(oText);
 oFragment.appendChild(oP);
 //创建代理人节点
 oP=XMLOpinionDoc.createElement("item");
 oP.setAttribute("name", "warrantstrold");
 oText=XMLOpinionDoc.createTextNode("");
 oP.appendChild(oText);
 oFragment.appendChild(oP);

//创建ideaitem节点，将oFragment添加到ideaitem上
var newNode = XMLOpinionDoc.createElement("ideaitem");
newNode.setAttribute("name", id)
newNode.appendChild(oFragment);
if(ItemNode){
//alert("t="+ItemNode.text);
//alert("newNode="+newNode.xml);
OpiniondocEle.replaceChild(newNode,ItemNode);	//替换旧节点
oldOpinionXml=ItemNode.xml;
}
var returnXML=XMLOpinionDoc.xml;
xmlList[0]=returnXML;
xmlList[1]=oldOpinionXml;
//alert("returnXML="+returnXML);
return xmlList;
}






//只删除字符串前面的空格
function moveQmkg(str){
var index=0;
for(i=0;i<str.length;i++){
	if(str.charAt(i)!=" "){
	index=i;
	break;
	}
}
//alert(index+" str="+str+" len="+str.length);
var returnStr=str.substr(index);
return returnStr;
}








//先检测行领导是否修改旧意见,如修改了旧意见，则将旧意见备份，将修改的意见组合成XML放在原意见域中。
//fieldName对应存放XML意见域，如QFidea_1;divShow为XML意见展示DIV
//add by ysw 0805
function saveModifyYj(fieldName,divShow){
var xmlOpinion=document.all(fieldName).value;
var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
XMLOpinionDoc.async = false;
xmlOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+xmlOpinion+"</ideaitems>";
//xmlOpinion=xmlOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	xmlOpinion=xmlOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	xmlOpinion=xmlOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	xmlOpinion=xmlOpinion.replace(/<ITEM/gi,"<item")
	xmlOpinion=xmlOpinion.replace(/<\/ITEM>/gi,"</item>")

var qfyjs=document.all.tempyjs;
var qfyjs_ry=document.all.tempyjs_ry;
var qfyjs_time=document.all.tempyjs_time;
var tempYj="";
var deptname="";
var cnName="";
var sTime=""
var fld_tempyj=document.all.fld_tempyj.value;
if(qfyjs){
if(qfyjs.length){
	for(var i=0;i<qfyjs.length;i++){
		if(qfyjs[i].value=="")continue;
		if(qfyjs_ry[i]){		
		qfyjs_ry_tmp=moveQmkg(qfyjs_ry[i].value);//去掉将字符串qfyjs_yj[i].value中前面空格
		var index=qfyjs_ry_tmp.indexOf(" ");
		//alert("qfyjs_ry_tmp="+qfyjs_ry_tmp+"  index="+index+" i="+i);
		if(index==-1)index=0;
		var signidea=qfyjs[i].value;
		var deptname=qfyjs_ry_tmp.substring(0,index);
		var cnName=qfyjs_ry_tmp.substr(index+1);
		deptname=deptname.replace(/ /g,"");
		cnName=cnName.replace(/ /g,"");		
		}
		if(qfyjs_time[i]){
		sTime=qfyjs_time[i].value;
		}
		var id=qfyjs[i].id;
		tempYj=signidea+"@@"+deptname+"##"+cnName+"$$"+sTime;
		//没找到表示已修改
		if(fld_tempyj.indexOf(tempYj)==-1){
		//alert("1="+xmlOpinion);
		var xmlList=replaceXmlOpinion(xmlOpinion,id,signidea,deptname,cnName,sTime);
		xmlOpinion=xmlList[0];	//取旧意见
		//document.all.fld_backupyj.value=document.all.fld_backupyj.value+xmlList[1];	//将旧意见备份		
		}	
	}
}
else{	//else条件为只有一条可编辑意见
	if(qfyjs!=""){
	qfyjs_ry_tmp=moveQmkg(qfyjs_ry.value);//去掉将字符串qfyjs_yj[i].value中前面空格
	var index=qfyjs_ry_tmp.indexOf(" ");
	//alert("qfyjs_ry_tmp="+qfyjs_ry_tmp+"  index="+index+" i="+i);
	if(index==-1)index=0;
	var signidea=qfyjs.value;
	var deptname=qfyjs_ry_tmp.substring(0,index);
	var cnName=qfyjs_ry_tmp.substr(index+1);
	deptname=deptname.replace(/ /g,"");
	cnName=cnName.replace(/ /g,"");
	var sTime=qfyjs_time.value;
	var id=qfyjs.id;
	tempYj=signidea+"@@"+deptname+"##"+cnName+"$$"+sTime;
	//没找到表示已修改
	if(fld_tempyj.indexOf(tempYj)==-1){
	var xmlList=replaceXmlOpinion(xmlOpinion,id,signidea,deptname,cnName,sTime);
	xmlOpinion=xmlList[0];	//取旧意见
	//document.all.fld_backupyj.value=document.all.fld_backupyj.value+xmlList[1];	//将旧意见备份
	//alert("modOpinion="+xmlOpinion);
	}
	}
}
}
//document.all.fld_backupyj.value=document.all.fld_backupyj.value+document.all(fieldName).value;
XMLOpinionDoc.loadXML(xmlOpinion);		//装载XML信息
OpiniondocEle = XMLOpinionDoc.documentElement;
var itemsNode=OpiniondocEle.selectNodes("//ideaitems/ideaitem");
var newOpinionXml="";
for(i=0;i<itemsNode.length;i++){
newOpinionXml=newOpinionXml+itemsNode[i].xml;
}
if(newOpinionXml!="")
document.all(fieldName).value=newOpinionXml;	//将新组合的XML存放在意见域中
//alert(newOpinionXml);
}

function showXmlOpinion_SW(ideaDiv,zqyjXML,divShow,columnName,type){
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
		//alert(XMLOpinion);
	var resulting = pagesource.transformNode(style);
	//var resulting=XMLOpinion;
	//alert(resulting);
	if(resulting!=""){
		LoadOpinionXml_SW(divShow,resulting);
	}
}
/*
  功能： 按时间降序显示XML意见,useless
	add by ysw 0805
*/
function LoadOpinionXml_SW(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(OpiniondocEle.xml);
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = OpiniondocEle.childNodes.length-1; i >=0; i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
			 // alert(department_receiver);
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
			  }   
		      //意见内容     
		      if(signidea!=""){
		     	 //SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:16px>"+blankstr+signidea+"</td></tr>";
					 //SignIdeaTR = "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"+signidea;
					 SignIdeaTR = signidea;
			}
		     //附件链接
		     //alert(curAttachFinally);
		      if(curAttachFinally!=""){
		      	curAttachFinally = curAttachFinally.replace(/<br><u>/gi,"&nbsp&nbsp&nbsp");
		      	
		    		 //SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:16px>"+curAttachFinally+"</td></tr></table></td></tr>";
			 			 //SignIdeaTR = SignIdeaTR + blankstr +curAttachFinally +"</td>";
			 			 SignIdeaTR = SignIdeaTR + blankstr +curAttachFinally ;
			}
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}

			if(signidea!=""){	
				//alert(SignIdeaTR);
				if(SignIdeaTR=="nbsp;"){
					SignIdeaTR = SignIdeaTR.replace("nbsp;","");
				}//alert("SignIdeaTR=="+SignIdeaTR);
			  	if(firstdepart_receiver!=""){
		       	 	 //SignIdeaDeptTR = SignIdeaDeptTR + "<tr><td valign='top' style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px;width:15%>"+firstdepart_receiver+"：</td>";
		       	 	 SignIdeaDeptTR = SignIdeaDeptTR +"<tr><td valign='top' style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px;width:15%>"+blankstr+firstdepart_receiver+"：";
		      	}else{
		        		 SignIdeaDeptTR = SignIdeaDeptTR +"<tr><td valign='top' style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px;width:15%>"+blankstr+department_receiver+"：";
		     	}
		     	//SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 //意见表格中落款日期时间
		     	 if(signedtime!=""){
		     		 //SignNameAndTimeTR = "<tr>";
		     		 SignNameAndTimeTR = "";
		     		 //SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:16px>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		if(AttachTR!=""){
		    	 			
		    	 			//SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 			SignNameAndTimeTR = SignNameAndTimeTR +blankstr+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		}else{
		    	 			SignIdeaTR = SignIdeaTR.replace("</td>","");
		    	 			
		    	 			SignNameAndTimeTR = SignNameAndTimeTR + blankstr+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		}
		    	 		 SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 }
		     	// alert(AttachTR);
					SignNameAndTimeTR = SignNameAndTimeTR.replace("<u>","");
					SignNameAndTimeTR = SignNameAndTimeTR.replace("</u>","");
					
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				}else if(firstdepart_receiver==LastDepartment){
					var tempTrObj="<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px></td>"
					var tempTrObj="<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"
					TmpTableTR= TmpTableTR +tempTrObj+blankstr+SignIdeaTR + SignNameAndTimeTR;
					//TmpTableTR= TmpTableTR +SignIdeaTR + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR +SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}
				//alert(TmpTableTR);
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				//替换回换行字符
				//TmpTableTR = TmpTableTR.replace("$#@@#$","<br>");
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
				
			}
		}        
	
	}
//	alert(tablehead+TmpTableTR+tableend);
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  


function showXmlOpinionNoDeptAndOrder(ideaDiv,zqyjXML,divShow,columnName,type){
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	//alert(XMLOpinion);
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/SWOpinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"item[@name='"+columnName+"']"; 
	}
	
	var resulting = pagesource.transformNode(style);
	if(resulting!=""){
		LoadOpinionXmlNoDeptAndDecent(divShow,resulting);
	}
}


/*
  功能： 按时间降序显示XML意见
	add by ysw 0805
*/
function LoadOpinionXmlNoDeptAndDecent(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center cellspacing=\"0\" CELLPADDING=\"0\" >";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = 0; i < OpiniondocEle.childNodes.length; i++){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
			  }   
		      //意见内容     
		      if(signidea!=""){
		     	// SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+signidea+"</td></tr>";
			 // SignIdeaTR = "<tr><td valign=\"top\" style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"+blankstr+signidea+"</td>";
				 SignIdeaTR = "<tr><td valign=\"top\" style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"+blankstr+signidea;
				 
			 }
		     //附件链接
		      if(curAttachFinally!=""){
		    		 //SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
				SignIdeaTR = SignIdeaTR+ "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr>";
				
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空可能由上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept&&signidea!=""){
				AttachTR="";
			}
			//只在同一部门的第一个意见下显示部门上传附件信息
			if(deptframe_receiver==LastDepartment&&signidea!=""){
				AttachTR="";
			}
			if(signidea!=""){	 
                  
		     		SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
                                             
		     	 	//意见表格中落款日期时间
		     	 	if(signedtime!=""){
					//SignNameAndTimeTR = "<tr>";
					SignNameAndTimeTR = "";
					//SignNameAndTimeTR = SignNameAndTimeTR + "<td valign=\"bottom\" style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px><div valign=\"bottom\">"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"&nbsp&nbsp&nbsp&nbsp</div></td>";
					SignNameAndTimeTR = SignNameAndTimeTR +"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"&nbsp&nbsp&nbsp&nbsp</div></td>";
					
					SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 	}
				
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				}else if(deptframe_receiver==LastDepartment){
					TmpTableTR= TmpTableTR + SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}else{
					TmpTableTR= TmpTableTR + SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
				}
				//alert("TmpTableTR=="+TmpTableTR);
				LastDepartment=deptframe_receiver;	//记录上一意见的部门	
				//TmpTableTR = TmpTableTR.replace("$#@@#$","<br>");
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  


//隐藏部门的意见for收文
function showXmlOpinionNoDept_SW(ideaDiv,zqyjXML,divShow,columnName,type){
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}	
	
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	//alert(XMLOpinion);
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	xslPath="/TanSun/XSLFile/opinionXml.xsl";
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
	}
	
	var resulting = pagesource.transformNode(style);
	//alert(resulting)
	if(resulting!=""){
		LoadOpinionXmlNoDept_SW(divShow,resulting);
	}
}


/*
  功能： 按时间降序显示XML意见
	add by ysw 0805
*/
function LoadOpinionXmlNoDept_SW(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	//alert(XMLOpinionDoc.xml);
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = OpiniondocEle.childNodes.length-1; i >=0; i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 				 
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
				
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");							
				 }     
				 curAttachFinally = tmpAttach;
				 //alert(curAttachFinally)
			  }   
		      //意见内容     
		      if(signidea!=""){
				  if(signidea=="nbsp;"){
					SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"
				  }else{

		     		SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"+blankstr+signidea
		     	  }
			 }
		     //附件链接
		      if(curAttachFinally!=""){
		    		// SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
					 //alert(SignIdeaTR)
				//	 curAttachFinally = curAttachFinally.replace(/<br><u>/gi,"&nbsp&nbsp&nbsp");
		    	 SignIdeaTR = SignIdeaTR + blankstr +curAttachFinally ;
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}

			if(signidea!=""){	 

		     		SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 	//意见表格中落款日期时间
		     	//if(signedtime!=""){
					//SignNameAndTimeTR = "<tr>";
					//SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;text-align:right;>"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"</td>";
				  //SignNameAndTimeTR = "";
				  //SignNameAndTimeTR = SignNameAndTimeTR +"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"&nbsp&nbsp&nbsp&nbsp</div></td>";
					
					//SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	//}
		     	if(signedtime!=""){
		     		 //SignNameAndTimeTR = "<tr>";
		     		 SignNameAndTimeTR = "";
		     		 //SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:16px>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		if(AttachTR!=""){
		    	 			
		    	 			//SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:17px>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 			SignNameAndTimeTR = SignNameAndTimeTR + blankstr+blankstr+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		}else{
		    	 			SignIdeaTR = SignIdeaTR.replace("</td>","");
		    	 			
		    	 			SignNameAndTimeTR = SignNameAndTimeTR + blankstr+blankstr+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		}
		    	 		 SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 }
			//	alert("firstdepart_receiver==="+firstdepart_receiver);
				//alert("LastDepartment========="+LastDepartment);
				//alert("TmpTableTR="+TmpTableTR);
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				
					//alert(TmpTableTR);
				}else if(firstdepart_receiver==LastDepartment){
					//TmpTableTR= TmpTableTR +SignIdeaTR + AttachTR + SignNameAndTimeTR;
					TmpTableTR= TmpTableTR +SignIdeaTR + SignNameAndTimeTR;
				
				}else{
					TmpTableTR= TmpTableTR +SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
					
				}
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	//alert(tablehead+TmpTableTR+tableend);
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  

//异步访问			
getAjaxData=function (url,sync,modth,isJson){
	var jsondata;
	var XMLHttpReq=false;
	if (isJson==undefined)
		isJson=true;
	//创建XMLHttpRequest对象       
	function createXMLHttpRequest() {
	    if (window.XMLHttpRequest) { //Mozilla 浏览器
	        XMLHttpReq = new XMLHttpRequest();
	    } else {
	        if (window.ActiveXObject) { // IE浏览器
	            try {
	                XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
	            }
	            catch (e) {
					//XMLHttpReq=false;
	                try {
	                    XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	                }
	                catch (e) {
						XMLHttpReq=false;
	                }
	            }
	        }
	    }
	}	
	//发送请求函数
	function processLoadResponse() {
		try{
			if (XMLHttpReq.readyState == 4) { // 判断对象状态
		    	if (XMLHttpReq.status == 200) { // 信息已经成功返回，开始处理信息
		    		if (isJson){
		            	jsondata=XMLHttpReq.responseText;	
		            }else{
		            	jsondata=XMLHttpReq.responseText;	
		            }
		        } else { //页面不正常
		            //alert("您所请求的页面有异常");
		        }
		   	}
	   	}catch(e){
	   		throw new Error(" processLoadResponse is Error!");
	   	}
	}
	createXMLHttpRequest();
	try{
		XMLHttpReq.open(modth,url,sync);
		//XMLHttpReq.setRequestHeader("Content-type","text/html");
		//XMLHttpReq.setRequestHeader("charset","gb2312"); 
		//XMLHttpReq.setRequestHeader("If-Modified-Since","0");   
		XMLHttpReq.onreadystatechange = processLoadResponse;//指定响应函数
		XMLHttpReq.send(null);  // 发送请求
	}catch(e){
		throw new Error("cgl.getJsonData");
	}
	if (jsondata==""){
		jsondata="ERROR";
	}
	return jsondata;
}	

/*
得到日期或时间函数
ajaxURL 制定代理地址
keystr=today //取得当天日期
keystr=time //取得当前时间
keystr=now //取得当前日期时间
*/
function getdatetime(ajaxURL,keystr)
{
	
	var ldrcStr=getAjaxData(ajaxURL,false,"GET");
	//alert(ldrcStr)
	var str_start="<result_today>";
	var str_end="</result_today>";

	str_start="<result_"+keystr+">";
		str_end="</result_"+keystr+">";
	
	var arr =ldrcStr.split(str_start);
	var str="";
	if (arr.length>0)
	{	
		var arr1=arr[1].split(str_end);
		str=arr1[0];
	}
	return str;
	
}

/*
以全屏模式打开窗口的方法
*/
function open_max(url)
{
	var swidth=screen.availWidth;
	var sheight=screen.availHeight;
	var wwidth=swidth-8;
	var wheight=sheight-120;
	window.open(url, '', 'Width='+wwidth+'px,Height='+wheight+'px,Left=0,Top=0,toolbar=yes,titlebar=yes,location=yes,menubar=yes,resizable=yes');
}

//收文行领导意见展示

function showLeaderXmlOpinion_SW(ideaDiv,zqyjXML,divShow,columnName,type){	
	var XMLOpinion = E(ideaDiv).innerHTML;	//读取XML意见
	if(zqyjXML!=""&&E(zqyjXML)){
		XMLOpinion=XMLOpinion+E(zqyjXML).value;	//读取XML意见
	}	
	
	//将XML意见加上头尾
	var XMLOpinion="<?xml version=\"1.0\" encoding=\"gb2312\" ?><ideaitems>"+XMLOpinion+"</ideaitems>";
	
	if(XMLOpinion=="")	return false;
	//XMLOpinion=XMLOpinion.toLowerCase();
	//避免把意见中的大写也转换为小写
	XMLOpinion=XMLOpinion.replace(/<IDEAITEM/gi,"<ideaitem")
	XMLOpinion=XMLOpinion.replace(/<\/IDEAITEM>/gi,"</ideaitem>")
	XMLOpinion=XMLOpinion.replace(/<ITEM/gi,"<item")
	XMLOpinion=XMLOpinion.replace(/<\/ITEM>/gi,"</item>")

	XMLOpinion = XMLOpinion.replace(/&lt;/g,"<");
	XMLOpinion = XMLOpinion.replace(/&gt;/g,">");
	XMLOpinion = XMLOpinion.replace(/<BR>/g,"");
	var index = XMLOpinion.indexOf("<?xml");
	XMLOpinion = XMLOpinion.substr(index);
	//alert(XMLOpinion);
	var  pagesource = new ActiveXObject("Microsoft.XMLDOM");
	pagesource.async = false;
	pagesource.loadXML(XMLOpinion);
	
	var style = new ActiveXObject("Microsoft.XMLDOM");
	style.async = false;
	//xslPath="/TanSun/XSLFile/opinionXml.xsl";
        if(columnName=="opinionserial"){
            xslPath="/TanSun/XSLFile/Swopinionxml.xsl";
        }else{
            xslPath="/TanSun/XSLFile/Swleaderopinionxml.xsl";
        }
	
	style.load(xslPath);
	if(columnName!=""){
		var sortColumn = style.selectSingleNode("//@order-by"); 
		//修改XSL排序列
		//sortColumn.value = type+"number(item[@name='"+columnName+"'])"; 
		if(type=="+"){
			 type = "-"
		}else if(type=="-"){
			 type = "+";
		}
	  sortColumn.value = type+"item[@name='"+columnName+"']"; 
	  
	}
	
	var resulting = pagesource.transformNode(style);
	
	if(resulting!=""){
		LoadLeaderOpinion_SW(divShow,resulting);
	}
}


/*
  功能： 按时间降序显示XML意见
	add by ysw 0805
*/
function LoadLeaderOpinion_SW(divShow,XMLOpinion){
	//定义缩进量(编辑状态与只读状态不同)
	var blankstr="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"


	var XMLOpinionDoc = new ActiveXObject("Microsoft.XMLDOM");
	XMLOpinionDoc.async = false;
	
	XMLOpinionDoc.loadXML(XMLOpinion);		//装载XML信息		
	
	OpiniondocEle = XMLOpinionDoc.documentElement;
	
	if (OpiniondocEle == null||XMLOpinionDoc.xml.replace(/ /g,"")==""){
		return false;
	}
	var firstRatioWidth=GetTableRatioWidth(divShow,18,1)
	var secondRatioWidth=GetTableRatioWidth(divShow,18,firstRatioWidth/100)
	var tablehead = "<table width="+firstRatioWidth+"% border=0 align=center>";
	var tableend = "</table>";
	var TmpTableTR="";
	var SignIdeaTR="";
	var AttachTR="";
	var SignIdeaDeptTR="";
	var SignNameAndTimeTR="";
	var LastDepartment="";	//上一意见部门，用于会签附件显示，如一部门反馈两条意见，但附件只在第一条意见中显示。
	var AttcachDept=""		//上传附件部门
	
	for (i = OpiniondocEle.childNodes.length-1; i >=0; i--){
		tmpNode = OpiniondocEle.childNodes[i];
	
		if (tmpNode) {
		       SignIdeaTR="";
			  SignIdeaDeptTR="";
			  SignNameAndTimeTR="";
		
		        //意见落款人当前部门
		       var department_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='department_receiver']")!=null){
				department_receiver = tmpNode.selectSingleNode("item[@name='department_receiver']").text;
			  }
			    //意见落款人当前部门全层次ID
		       var deptframe_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='deptframe_receiver']")!=null){
				deptframe_receiver = tmpNode.selectSingleNode("item[@name='deptframe_receiver']").text;
			  }	  
		        //意见落款人当前部门编号
		       var department_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='department_deptno']")!=null){
				department_deptno = tmpNode.selectSingleNode("item[@name='department_deptno']").text;
		 	  }
		        //意见落款人一级部门
		       var firstdepart_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_receiver']")!=null){
			  	firstdepart_receiver = tmpNode.selectSingleNode("item[@name='firstdepart_receiver']").text;
			  }
		        //意见落款人一级部门编号
		       var firstdepart_deptno = "";
			  if(tmpNode.selectSingleNode("item[@name='firstdepart_deptno']")!=null){
			  	firstdepart_deptno = tmpNode.selectSingleNode("item[@name='firstdepart_deptno']").text;
			  }
		        //意见落款人中文名
		       var chinesename_receiver = "";
			  if(tmpNode.selectSingleNode("item[@name='chinesename_receiver']")!=null){
				chinesename_receiver = tmpNode.selectSingleNode("item[@name='chinesename_receiver']").text;
			  }
		        //落款意见
		       var signidea = "";
			  if(tmpNode.selectSingleNode("item[@name='signidea']")!=null){
				signidea = tmpNode.selectSingleNode("item[@name='signidea']").text;
			  }
		        //落款时间
			var signedtime = "";
			  if(tmpNode.selectSingleNode("item[@name='signedtime']")!=null){
				signedtime = tmpNode.selectSingleNode("item[@name='signedtime']").text;
			  }
			  signedtime=DealDateStr(signedtime)
		        //代理人信息
		       var warrantstrold = "";
			  if(tmpNode.selectSingleNode("item[@name='warrantstrold']")!=null){
			  	warrantstrold = tmpNode.selectSingleNode("item[@name='warrantstrold']").text;   
			  } 
		       //最终附件
		       var curAttachFinally = "";
		       if(tmpNode.selectSingleNode("item[@name='curattachfinally']")!=null){
		           var tmpAttach = "";
				 tmpAttach = tmpNode.selectSingleNode("item[@name='curattachfinally']").text; 
				 //alert(tmpAttach)
				 if(tmpAttach!=""){
					//特殊字符替换：<=%%、>=**、/=@@、"=$$
					tmpAttach=tmpAttach.replace(/∷∷/gi,"</u></a>&nbsp;&nbsp;");
					tmpAttach=tmpAttach.replace(/≌≌/gi,"'><u>");	
					tmpAttach=tmpAttach.replace(/\*\*/gi,">");
					tmpAttach=tmpAttach.replace(/\%\%/gi,"<");
					tmpAttach=tmpAttach.replace(/\@\@/gi,"/");
					tmpAttach=tmpAttach.replace(/\$\$/gi,"'");		
					tmpAttach=tmpAttach.replace(/<br>/gi,"");		
				 }     
				 curAttachFinally = tmpAttach;
				 //alert(curAttachFinally)
			  }   
		      //意见内容     
		      if(signidea!=""){
		     	 //SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+signidea+"</td></tr>";
                         if (signidea=="%@##@%;")
		     	     SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>";
                         else 
		     	     SignIdeaTR = "<tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+blankstr+signidea;
		     	  
			 }
		     //附件链接
		      if(curAttachFinally!=""){
		    		// SignIdeaTR = SignIdeaTR+ "<tr><td><table width="+secondRatioWidth+"% align=center><tr><td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+curAttachFinally+"</td></tr></table></td></tr>";
					 //alert(SignIdeaTR)
					 curAttachFinally = curAttachFinally.replace("<br>","&nbsp&nbsp&nbsp");
		    	 SignIdeaTR = SignIdeaTR + blankstr +curAttachFinally +"</td>";
			 }
		      //意见表格中落款人部门名和中文名组合
		      SignIdeaDeptTR = "";
		      if(warrantstrold!=""){
				chinesename_receiver=chinesename_receiver+warrantstrold; //记录代理人信息   
			 }
			  //有附件时调整显示顺序
		      if(curAttachFinally!=""){
				if(TmpTableTR==""){
		    		     TmpTableTR=  SignIdeaDeptTR;
		    		 }else{
		     	     	     TmpTableTR= TmpTableTR + SignIdeaDeptTR;
		    		}
				AttachTR = SignIdeaTR;	
				AttcachDept=firstdepart_receiver		//记录附件的部门
			 }
			 //清空上一部门遗留的附件信息
			if(firstdepart_receiver!=AttcachDept && signidea!=""){
				AttachTR="";
			}

			if(signidea!=""){	 

		     		SignIdeaDeptTR = SignIdeaDeptTR + "</tr>";
		     	 	//意见表格中落款日期时间
		     	//if(signedtime!=""){
					//SignNameAndTimeTR = "<tr>";
					//SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;text-align:right;>"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"</td>";
				  //SignNameAndTimeTR = "";
				  //SignNameAndTimeTR = SignNameAndTimeTR +"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+chinesename_receiver+"&nbsp;&nbsp"+signedtime+blankstr+"&nbsp&nbsp&nbsp&nbsp</div></td>";
					
					//SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	//}
		     	if(signedtime!=""){
		     		 //SignNameAndTimeTR = "<tr>";
		     		 SignNameAndTimeTR = "";
		     		 //SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;font-size:16px>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		if(AttachTR!=""){
		    	 			
		    	 			SignNameAndTimeTR = SignNameAndTimeTR + "<td style=font-family:\"华文楷体\",Verdana,Geneva,sans-serif;>"+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		}else{
		    	 			SignIdeaTR = SignIdeaTR.replace("</td>","");
		    	 			
		    	 			SignNameAndTimeTR = SignNameAndTimeTR +blankstr+chinesename_receiver+"&nbsp;&nbsp;&nbsp"+signedtime+blankstr+"</td>";
		    	 		}
		    	 		 SignNameAndTimeTR = SignNameAndTimeTR + "</tr>";
		     	 }
				//alert("firstdepart_receiver==="+firstdepart_receiver);
				//alert("LastDepartment========="+LastDepartment);
				if(TmpTableTR==""){
					TmpTableTR=SignIdeaDeptTR+ SignIdeaTR + AttachTR + SignNameAndTimeTR;
				
					//alert(TmpTableTR);
				}else if(firstdepart_receiver==LastDepartment){
					//TmpTableTR= TmpTableTR +SignIdeaTR + AttachTR + SignNameAndTimeTR;
					TmpTableTR= TmpTableTR +SignIdeaTR + SignNameAndTimeTR;
				
				}else{
					TmpTableTR= TmpTableTR +SignIdeaDeptTR+ SignIdeaTR +AttachTR + SignNameAndTimeTR;
					
				}
				LastDepartment=firstdepart_receiver	//记录上一意见的部门	
				TmpTableTR = TmpTableTR.replace(/%@##@%;/gi,"&nbsp;");
				TmpTableTR = TmpTableTR.replace(/%#@@#%/gi,"<br>");
			}
		}        
	
	}
	
	if(E(divShow)){
		E(divShow).innerHTML=tablehead+TmpTableTR+tableend;
	}
}  

//added by dongjun on 20110303 
//实现如果只有一个链接前面的序号去掉
function checkAttachforOne( strAttach){

	if(strAttach.indexOf("2.<a") == -1){
		strAttach = strAttach.replace("1.<a","<a");
	}
	return strAttach;
}