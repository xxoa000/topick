package com.lch.topick.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;


// 커스텀 예외 클래스, 의도적으로 발생 시키는 예외를 담을 클래스
@Getter
public class CustomException extends RuntimeException {
	
	private static final long serialVersionUID = 1L;
	
	private final ErrorCode errorCode;
	
	//에러메세지 확인용
	public CustomException(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode=errorCode;
	}
}//class
