package main.java;

import com.alibaba.fastjson.JSON;

/**
 * Created by 陈奇 on 2016/7/29 0029.
 */
public class TestJson {

    public static void main(String[] args) {

        Students stu = new Students("chenqi", 23);
        String stu_string = JSON.toJSONString(stu);
        System.out.println("字符串的格式："+stu_string);

        String src = "{\"age\":23,\"name\":\"chenqi\"}";
        User user = JSON.parseObject(src, User.class);
        System.out.println( user.toString());

    }
}
