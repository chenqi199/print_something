//package com.bshinfo.cl.util.security;
//
//import javax.servlet.http.HttpSession;
//
//import ServerIPAddress;
//import com.bshinfo.cl.model.User;
//
//public class SXYSessionUtils {
//	public static final String USER = "CHINALIFE_USER";
//
//	private static ThreadLocal<HttpSession> requestLocal = new ThreadLocal<HttpSession>();
//
//	public static void setSession(HttpSession session) {
//		requestLocal.set(session);
//	}
//
//	public static User getUserFromSession() {
//		User user = (User) requestLocal.get().getAttribute(SXYSessionUtils.USER);
//		return user;
//	}
//
//	public static String getUseridFromSession() {
//		String userid = "9000";
//		try {
//			if (requestLocal.get() != null) {
//				User user = (User) requestLocal.get().getAttribute(SXYSessionUtils.USER);
//				return (user == null ? userid : user.getId());
//			}
//		} catch (Exception e) {
//		}
//		return userid;
//	}
//
//	public static String getIp() {
//		String ip = ServerIPAddress.getHostIp(ServerIPAddress.getInetAddress());
////		try {
////			if (requestLocal.get() != null) {
////				String sessionIp = (String) requestLocal.get().getAttribute("ip");
////				return (sessionIp == null ? ip : sessionIp);
////			}
////		} catch (Exception e) {
////		}
//		return ip;
//	}
//
//
//
//}
