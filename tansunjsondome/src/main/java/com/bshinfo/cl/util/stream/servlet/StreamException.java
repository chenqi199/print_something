package com.bshinfo.cl.util.stream.servlet;

public class StreamException extends Exception {
	private static final long serialVersionUID = -6419163024452986449L;

	/** args error: the data block start position error */
	public static final int ERROR_FILE_RANGE_START = 409;
	/** the file has delete for break point upload */
	public static final int ERROR_FILE_NOT_EXIST = 401;

	private int code;

	public StreamException(int code) {
		this.code = code;
	}

	public int getCode() {
		return code;
	}
}
