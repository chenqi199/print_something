package com.bshinfo.cl.util.formater;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateFormater {

	public DateFormater() {
	}

	public static String toLongDateString(Date dt){
        SimpleDateFormat myFmt=new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒 E ");        
        return myFmt.format(dt);
    }
    
    public static String toShortDateString(Date dt){
        SimpleDateFormat myFmt=new SimpleDateFormat("yy年MM月dd日 HH时mm分");        
        return myFmt.format(dt);
    }
    
    public static String toShortYMDString(Date dt){
        SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd");        
        return myFmt.format(dt);
    }
    
    public static Date toCustomBeginDate(Date dt) throws ParseException{
        SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd");        
        String str = myFmt.format(dt) +" 00:00:00";
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		Date date = null;
 		date = formatter.parse(str);
 		return date;
    }
    
    public static Date toCustomEndnDate(Date dt,long lday) throws ParseException{
        SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd");        
        String str = myFmt.format(dt) +" 23:59:59";
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		long lDate = formatter.parse(str).getTime();
 		long lDay = lday * 24 * 3600 * 1000;
 		return new java.util.Date(lDate + lDay);
    }
    
    public static Date toCustomMinusMin(Date dt,long lMin) throws ParseException{
    	SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	String str = myFmt.format(dt);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		long lDate = formatter.parse(str).getTime();
 		long lDay = lMin * 60 * 1000;
 		return new java.util.Date(lDate - lDay);
    }
    
	public static String getExceptionCompactDateTimeString(){
		Date dt = new Date();
        SimpleDateFormat myFmt=new SimpleDateFormat("MMddHHmmss");        
        return myFmt.format(dt);
    }   	
    
    public static String toLongTimeString(Date dt){
        SimpleDateFormat myFmt=new SimpleDateFormat("HH mm ss SSSS");        
        return myFmt.format(dt);
    }
    
    public static String toShortTimeString(Date dt){
        SimpleDateFormat myFmt=new SimpleDateFormat("yy/MM/dd HH:mm");        
        return myFmt.format(dt);
    }
    
    public static String getOrderCodeString(){
        SimpleDateFormat myFmt=new SimpleDateFormat("yyyyMMddHHmm");        
        return "DD"+myFmt.format(new Date());
    }
    
    
    public static void main(String [] args){
    	//System.out.println(toShortYMDString(new Date()));
    }
    
    public static String addDays(Date dt, int days){
    	SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd");
    	Calendar cl = Calendar.getInstance();
	    cl.setTime(dt);
	    cl.add(Calendar.DATE,days);
        return myFmt.format(cl.getTime());
    }
    
    public static Date addDayToDay(Date dt, int days){
    	Calendar cl = Calendar.getInstance();
	    cl.setTime(dt);
	    cl.add(Calendar.DAY_OF_YEAR, days);
        return cl.getTime();
    }
    
    /**
     * 
     * @param beginTime
     * @param endTime
     * @param timeFormate "yyyy-MM-dd HH:mm:ss" 或者 "yyyy-MM-dd"
     * @param endAdd1Flag 结束日期是否需要加1天  0 不加  1 加
     * @return 0 未开始  1 进行中  2 已结束
     */
    public static String getActionTypeByBeginAndEndTime(String beginTime,String endTime,String timeFormate,String endAdd1Flag){
    	String info="";
    	SimpleDateFormat sdf = new SimpleDateFormat(timeFormate);
    	try {
			Date beginDate = sdf.parse(beginTime);
			Date endDate = sdf.parse(endTime);
			//结束日期加一天
			if(endAdd1Flag.equals("1")){
				Calendar calendar=Calendar.getInstance();  
				calendar.setTime(endDate);
				calendar.add(Calendar.DATE, 1); 
				endDate = calendar.getTime();
			}
			Date now = new Date();
			if(beginDate.after(now)){
				info="0";
			}else if(now.after(beginDate)&&endDate.after(now)){
				info="1";
			}else if(now.after(endDate)){
				info="2";
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
    	return info;
    }
    
    public static Date getDate(String d){
    	 try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			 Date date = sdf.parse(d);
			 return date;
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
    }
   
}
