package com.lch.topick.exception;

import org.springframework.http.ResponseEntity;

import lombok.Builder;
import lombok.Getter;

// 클라이언트에게 항상 동일한 JSON 형태로 에러를 전달하기 위한 DTO 객체
@Getter
@Builder
public class ErrorResponseDTO {
	private int status;
	private String name;    //서버에서 지정한 ErrorCode 상수명을 가져옴
	private String message;
	
	public static ResponseEntity<ErrorResponseDTO> toResponseEntity(ErrorCode errorCode) {
		return ResponseEntity
				.status(errorCode.getStatus())
				.body(ErrorResponseDTO.builder()
						.status(errorCode.getStatus().value())
						.name(errorCode.name())
						.message(errorCode.getMessage())
						.build()
				);
	}
	
} //class
