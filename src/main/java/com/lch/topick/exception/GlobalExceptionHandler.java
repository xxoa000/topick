package com.lch.topick.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	// 1. 직접 정의한 비즈니스 예외 처리
	@ExceptionHandler(CustomException.class)
	protected ResponseEntity<ErrorResponseDTO> handleCustomException(CustomException e) {
		return ErrorResponseDTO.toResponseEntity(e.getErrorCode());
	}
	
	// 2. 그 외 모든 예외 처리 (예상치 못한 서버 에러)
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ErrorResponseDTO> handleException(Exception e) {
		return ErrorResponseDTO.toResponseEntity(ErrorCode.INTERNAL_SERVER_ERROR);
	}
	
	
} //class
