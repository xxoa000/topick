package com.lch.topick.web.filter.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.filter.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {
    // tag_status 가 active 인 태그만 조회
    List<Tag> findByTagStatus(String tagStatus);
    
}
