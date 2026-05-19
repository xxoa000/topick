package com.lch.topick.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;


// 커스텀 예외 클래스, 의도적으로 발생 시키는 예외를 담을 클래스
@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {
	private final ErrorCode errorCode;
}//class
