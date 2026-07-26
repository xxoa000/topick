package com.lch.topick.web.pick.repository;

import com.lch.topick.web.pick.entity.PickEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PickRepository extends JpaRepository<PickEntity, Long> {
	//JpaRepository를 상속받으면 기본적인 CRUD 기능(저장, 조회, 수정, 삭제) 자동으로 사용 가능
	//pickEntity: 테이블, Long: PK type
}