package com.lch.topick.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

/*
 * 400 BAD_REQUEST : 잘못된 요청
 * 401 UNAUTHORIZED : 인증이 필요한 요청이나 인증 실패
 * 403 FORBIDDEN : 권한이 없는 요청
 * 404 NOT_FOUND : 요청한 리소스를 찾을 수 없음
 * 409 CONFLICT : 데이터 중복
 * 500 INTERNAL_SERVER_ERROR : 서버 내부 에러
 * 502 BAD_GATEWAY : 서버 위 단의 프록시나 gateway 에러
 */ 

@Getter
@AllArgsConstructor
public enum ErrorCode {
	
	// Success
	JOIN_SUCCESS(HttpStatus.CREATED, "회웝가입 되었습니다. 로그인 후 사용해주세요."),				//201
	LOGIN_SUCCESS(HttpStatus.OK, "정상적으로 로그인 되었습니다."),									//200
	LOGOUT_SUCCESS(HttpStatus.OK, "정삭적으로 로그아웃 되었습니다."),								//200

    // Common
	INPUT_INVALID_VALUE(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),						// 400
	INPUT_INVALID_FAIL(HttpStatus.BAD_REQUEST, "입력값 검증에 실패했습니다."),
	REQUEST_BODY_INVALID(HttpStatus.BAD_REQUEST, "요청 본문 형식이 올바르지 않습니다."),
    METHOD_NOT_ALLOW(HttpStatus.METHOD_NOT_ALLOWED, "지원하지 않는 HTTP 메서드입니다."),			// 405
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 에러가 발생했습니다."),		// 500

    // Auth
    ACCESS_TOKEN_MISSING(HttpStatus.UNAUTHORIZED, "토큰을 찾을 수 없습니다."),						// 401
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    
    // JWT
    JWT_MALFORMED(HttpStatus.UNAUTHORIZED, "잘못된 형식의 토큰입니다."),							// 401
    JWT_EXPIRED(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    JWT_INVALID(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    JWT_ERROR(HttpStatus.UNAUTHORIZED, "토큰 검증 중 오류가 발생했습니다."),

    // Member
    LOGIN_FAILED(HttpStatus.BAD_REQUEST, "아이디 또는 비밀번호가 일치하지 않습니다."),				// 400
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."),						// 404
    MEMBER_EMAIL_EXIST(HttpStatus.CONFLICT, "이미 가입된 이메일 입니다."),							// 409
    MEMBER_PHONE_EXIST(HttpStatus.CONFLICT, "이미 가입된 번호 입니다."),
    MEMBER_ID_EXIST(HttpStatus.CONFLICT, "이미 존재하는 ID 입니다."),

    // Store
    STORE_NOT_FOUND(HttpStatus.NOT_FOUND, "가게 정보를 찾을 수 없습니다."),							// 404

    // Menu
    MENU_NOT_FOUND(HttpStatus.NOT_FOUND, "메뉴 정보를 찾을 수 없습니다."),							// 404
    MENU_OPTION_NOT_FOUND(HttpStatus.NOT_FOUND, "메뉴 옵션 정보를 찾을 수 없습니다."),
    INSUFFICIENT_MENU_STOCK(HttpStatus.CONFLICT, "메뉴 재고가 부족합니다."),						// 409

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문 정보를 찾을 수 없습니다."),							// 404
    ORDER_CANNOT_CANCEL(HttpStatus.CONFLICT, "취소할 수 없는 주문입니다."),							// 409

    // Payment
    PAYMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "결제 정보를 찾을 수 없습니다."),						// 404
    KAKAOPAY_API_ERROR(HttpStatus.BAD_GATEWAY, "카카오페이 API 요청 중 오류가 발생했습니다.");		// 502
	
	private final HttpStatus status;
	private final String message;
	
}//class