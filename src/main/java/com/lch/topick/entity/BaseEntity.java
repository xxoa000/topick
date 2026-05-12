package com.lch.topick.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

/* @MappedSuperclass
 * - 테이블을 생성하지 않고, 상속받은 엔터티에 컬럼만 추가해주는 에너테이션
 * - 등록,수정 시간 등 자동으로 추가, 변경되는 공통 컬럼들을 자동으로 넣기 위해 사용
 * - application.properties > spring.jpa.hibernate.ddl-auto=validate 인 상태여도 동작함
 */

@MappedSuperclass
@EntityListeners(value= {AuditingEntityListener.class})
@Getter
public class BaseEntity {
	
	@CreatedDate //생성시간을 알 수 있음
	@Column(name="create_at", nullable=false , updatable=false) //NOT NULL, 수정불가로 설정
	private LocalDateTime createAt; //등록한 시간
	
	@LastModifiedDate //수정시간을 자동 저장
	@Column(name="update_at", nullable=false) //updatable default 는 수정 가능
	private LocalDateTime updateAt; //수정한 시간
	
}//class
