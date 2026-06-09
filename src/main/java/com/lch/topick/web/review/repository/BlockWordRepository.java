package com.lch.topick.web.review.repository;

import com.lch.topick.web.review.entity.BlockWordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockWordRepository extends JpaRepository<BlockWordEntity, Long> {
	
}