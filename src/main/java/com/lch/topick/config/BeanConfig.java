package com.lch.topick.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

// 기본적인 Bean 설정용
@Configuration
public class BeanConfig {
	
	/* PasswordEncoder 적용시 
	 * BackApplication.java 에
	 * @SpringBootApplication(exclude={SecurityAutoConfiguration.class}) 코드 붙어있는지 확인
	 * => 초기 배포시 설정해뒀음 */
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean // for StoreProxy
    RestTemplate restTemplate() {
        return new RestTemplate();
    }

}//class
