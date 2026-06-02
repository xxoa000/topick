package com.lch.topick.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	private final long MAX_AGE_SECS = 3600; //단위는 초
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:5173")
				/* - 배포후 참고
				 *   "http://52.78.164.109:8080", "http://52.78.164.109" */
				.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
				/* - CORS정책상 접근 가능한 origin인지 확인하기 위해 preflight를 보내는데, 
		         *   이때 메소드가 'OPTIONS' 이므로 반드시 추가 */ 
				.allowedHeaders("*")
				/* - 브라우저가 “쿠키, 세션, 로그인 정보 같은 인증 정보(credential)”를 포함한 요청을 서버에 보낼 수 있게 허용하는 설정
		         *   세션기반 로그인, 쿠키로 인증 처리할 때, JWT를 쿠키에 담아 쓸 때 등등 필요함            
		         * - 단 credentials true 로 이것을 허용하면, allowedOrigins("*") 로 전체허용은 허용하지않음
		         *   (그러므로 origins 속성값은 구체적으로 명시함) */
				.allowCredentials(true)
				.maxAge(MAX_AGE_SECS);
	}//addCorsMappings

	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 실제 이미지가 저장된 로컬 경로로 매핑되도록
        registry.addResourceHandler("/uploads/reviews/**")
        .addResourceLocations("file:///D:/kdt/topick/back/src/main/resources/static/uploads/reviews/");
    }
	
}//class
