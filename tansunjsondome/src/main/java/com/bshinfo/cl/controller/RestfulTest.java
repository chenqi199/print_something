package com.bshinfo.cl.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;

/**
 * Created by 陈奇 on 2017/5/3 0003.
 */
@Controller
@RequestMapping("/rest")
public class RestfulTest {

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String index(@PathVariable("id") String id) throws UnsupportedEncodingException {
       return new String(id.getBytes("iso8859-1"),"utf-8");
    }





}
