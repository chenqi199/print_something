package main.java;

/**
 * Created by 陈奇 on 2016/7/29 0029.
 */
public class Students {

    private String name;

    private Integer age;

    public Students() {
    }

    public Students(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
