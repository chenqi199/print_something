package com.bshinfo.cl.util.db;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.bshinfo.cl.util.formater.AESDemo;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

public class TheStringTypeHandler extends BaseTypeHandler<String> {

	@Override
	public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
		//取得列值
		String value = rs.getString(columnName);
		//列值为空
		if(value == null){
			return "--";
		}else{
			//是加密的字段则进行解密工作
			try {
				value= AESDemo.decrypt(value);
			} catch (Exception e) {}
			return value;
		}
	}

	@Override
	public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		//取得列值
		String value = rs.getString(columnIndex);
		//列值为空
		if(value == null){
			return "--";
		}else{
			//是加密的字段则进行解密工作
			try {
				value=AESDemo.decrypt(value);
			} catch (Exception e) {}
			return value;
		}
	}

	@Override
	public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		//取得列值
		String value = cs.getString(columnIndex);
		//列值为空
		if(value == null){
			return "--";
		}else{
			try {
				value=AESDemo.decrypt(value);
			} catch (Exception e) {}
			return value;
		}
	}

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {
		try {
			parameter = AESDemo.encrypt(parameter);
		} catch (Exception e) {}
		ps.setString(i, parameter);
	}
	
}
