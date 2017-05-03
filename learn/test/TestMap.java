import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by 陈奇 on 2017/5/3 0003.
 */
public class TestMap {
    public static void main(String[] args) {
        HashMap<String,String> hashMap = new HashMap<>(20);
        hashMap.put("aa","bbb");
        hashMap.put("ss","bbb");
        hashMap.put("vv","bbb");
        hashMap.put("bb","bbb");

        Iterator<Map.Entry<String,String>> entryIterator = hashMap.entrySet().iterator();
        while (entryIterator.hasNext()){
            Map.Entry<String, String> entry = entryIterator.next();
            System.out.println(entry.getKey()+"--------------"+entry.getValue());
        }

        DateFormat dataFormat = new SimpleDateFormat("YYYY--MM__dd__HH__mm");
        String s = dataFormat.format(new Date());
        System.out.println(s);
        DateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
        DateFormat format2= new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒");
        Date date = null;
        String str = null;

// String转Date
        str = "2007-1-18";
        try {
            date = format1.parse(str);
            String ss = format2.format(date);
            System.out.println(ss);
        } catch (ParseException e) {
            e.printStackTrace();
        }

    }
}
