//package com.bshinfo.cl.util.security;
//
//import net.sf.json.JSONObject;
//import org.apache.commons.lang.StringUtils;
//
//import javax.servlet.*;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;
//import java.io.IOException;
//import java.text.SimpleDateFormat;
//import java.util.Enumeration;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.regex.Pattern;
//
///**
// * 用于检查用户是否登录了系统的过滤器
// * 创建日期：2016-10-09
// */
//public class SXYSessionFilter implements Filter {
//
//    /** 要检查的 session 的名称 */
//    private String sessionKey;
//
//    /** 需要排除（不拦截）的URL的正则表达式 */
//    private Pattern excepUrlPattern;
//
//    /** 检查不通过时，转发的URL */
//    private String forwardUrl;
//
//    private JSONObject json = new JSONObject();
//
//    @Override
//    public void init(FilterConfig cfg) throws ServletException {
//        sessionKey = cfg.getInitParameter(SXYSessionUtils.USER);
//
//        String excepUrlRegex = cfg.getInitParameter("excepUrlRegex");
//        if (!StringUtils.isBlank(excepUrlRegex)) {
//            excepUrlPattern = Pattern.compile(excepUrlRegex);
//        }
//        forwardUrl = cfg.getInitParameter("forwardUrl");
//    }
//
//    @Override
//    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
//
//		HttpServletRequest request = (HttpServletRequest) req;
//		HttpServletResponse response = (HttpServletResponse) res;
//		request.setCharacterEncoding("UTF-8");
//		response.setCharacterEncoding("UTF-8");
//		HttpSession session=request.getSession();
//		Object obj = session.getAttribute(SXYSessionUtils.USER);
//		String path = request.getServletPath();
//		if(checkIsXSSAndSQL(request)){
//    		json.put("success",false);
//    		json.put("msg","您发送请求中的参数中含有非法字符");
//    		response.getWriter().write(json.toString());
//    		return;
//    	} else {
//    		request = new RequestWrapper(request);
//    	}
//		if(obj == null){
//			System.out.println("obj is null *********************************");
//			if(path.equals("/home/login.do")){
//				System.out.println("this is login in request !!!!!!");
//				chain.doFilter(request, response);
//			}else{
//				System.out.println("redriect to the login action!!!");
//				response.sendRedirect("/ChinaLifeManage/home/login.do");
//			}
//		}else{
//			System.out.println("dododooodoododoodoodood   filter");
//
//			chain.doFilter(request, response);
//		}
//
//    }
//
//    @Override
//    public void destroy() {
//    }
//
//    private boolean checkIsXSSAndSQL(HttpServletRequest req){
//		//获得白名单
//		Map whiteList = getWhiteList(req);
//		//检测头信息
//		Enumeration eh = req.getHeaderNames();
//		while(eh.hasMoreElements()){
//			String name = (String)eh.nextElement();
//			if(!whiteList.containsKey(name)){
//				String value = req.getHeader(name);
//				if(checkIsXSS(value)){
//					return true;
//				}
//			}
//		}
//		eh=null;
//
//		//检测参数信息
//		Enumeration ep = req.getParameterNames();
//		while(ep.hasMoreElements()){
//			String name = (String)ep.nextElement();
//			if(!whiteList.containsKey(name)){
//				String[] values = req.getParameterValues(name);
//				if(values == null){
//					String value = req.getParameter(name);
//					if(!isValidDate(value)){
//						if(checkIsXSS(value) || checkIsSQL(value)){
//							return true;
//						}
//					}
//				}else{
//					for(int i=0;i<values.length;i++){
//						String value = values[i];
//						if(!isValidDate(value)){
//							if(checkIsXSS(value) || checkIsSQL(value)){
//								return true;
//							}
//						}
//					}
//				}
//			}
//		}
//		ep=null;
//		return false;
//	}
//
//	/**
//	 * 获得白名单
//	 */
//	private Map getWhiteList(HttpServletRequest req){
//		//取得白名单。
//		String convHtmlField = req.getParameter("convHtmlField");
//		Map map = new HashMap();
//		if(convHtmlField != null){
//			String[] convs = convHtmlField.split(",");
//			for(int i=0;i<convs.length;i++){
//				map.put(convs[i], null);
//			}
//			convs = null;
//		}
//		return map;
//	}
//
//	/**
//	 * 检测XSS攻击
//	 */
//	private boolean checkIsXSS(String value){
//
//		 if (value != null) {
//			 if(value.equals("-1")) return false;
//            //Avoid anything between script tags
//            Pattern scriptPattern = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器1.");
//    		    return true;
//    		}
//
//            //Avoid anything in a src='...' type of e­xpression
//            scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器2.");
//    		    return true;
//    		}
//
//            scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器3.");
//    		    return true;
//    		}
//
//            //Remove any lonesome </script> tag
//            scriptPattern = Pattern.compile("</script>", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器4.");
//    		    return true;
//    		}
//
//            //Remove any lonesome <script ...> tag
//            scriptPattern = Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器5.");
//    		    return true;
//    		}
//
//            //Avoid eval(...) e­xpressions
//            scriptPattern = Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器6.");
//    		    return true;
//    		}
//
//            //Avoid e­xpression(...) e­xpressions
//            scriptPattern = Pattern.compile("e­xpression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器7.");
//    		    return true;
//    		}
//
//            //Avoid javascript:... e­xpressions
//            scriptPattern = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器8.");
//    		    return true;
//    		}
//
//            //Avoid vbscript:... e­xpressions
//            scriptPattern = Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器9.");
//    		    return true;
//    		}
//
//            //Avoid onload= e­xpressions
//            scriptPattern = Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器10.");
//    		    return true;
//    		}
//
//            scriptPattern = Pattern.compile("<(no)?script[^>]*>.*?</(no)?script>", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器11.");
//    		    return true;
//    		}
//
//            scriptPattern = Pattern.compile("view-source:", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器12.");
//    		    return true;
//    		}
//
//            scriptPattern = Pattern.compile("<(\"[^\"]*\"|\'[^\']*\'|[^\'\">])*>", Pattern.CASE_INSENSITIVE);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器13.");
//    		    return true;
//
//    		}
//
//            scriptPattern = Pattern.compile("(window\\.location|window\\.|\\.location|document\\.cookie|document\\.|alert\\(.*?\\)|window\\.open\\()", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器14.");
//    		    return true;
//    		}
//
//            scriptPattern = Pattern.compile("<+\\s*\\w*\\s*(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)+\\s*=+", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
//            if (scriptPattern.matcher(value).find()) {
//    		    System.out.println("未能通过过滤器15.");
//    		    return true;
//    		}
//		 }
//		 return false;
//	}
//
//	/**
//	 * 检测SQL攻击
//	 */
//	private boolean checkIsSQL(String value){
//		if(value.equals("-1")) return false;
//		if(value.indexOf("+")>=0){
//			 System.out.println(value+"未能通过过滤器SQL1.");
//			 return true;
//		}
////		if(value.indexOf("-")>=0){
////			 System.out.println(value+"未能通过过滤器.");
////			 return true;
////		}
//		String reg1 = "(?:')|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|"
//	            + "(\\b(select|update|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)";
//		Pattern sqlPattern = Pattern.compile(reg1, Pattern.CASE_INSENSITIVE);
//		if (sqlPattern.matcher(value).find()) {
//		    System.out.println("未能通过过滤器SQL2.");
//		    return true;
//		}
//		return false;
//	}
//
//	public boolean isValidDate(String s)
//    {
//    	boolean date1 = false;
//    	boolean date2 = false;
//	 	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//	    try
//	    {
//	    	dateFormat.parse(s);
//	    	date1 = true;
//	    }
//	    catch (Exception e)
//	    {
//
//	    }
//	    SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd");
//	    try
//	    {
//	    	dateFormat1.parse(s);
//	    	date2 = true;
//	    }
//	    catch (Exception e)
//	    {
//
//	    }
//	    if(date1 || date2){
//	    	return true ;
//	    }else{
//	    	return false;
//	    }
//
//    }
//}