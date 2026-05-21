package com.lch.topick.web.review.repository;

import com.lch.topick.web.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    // 특정 가게의 전체 리뷰 목록 조회
    List<ReviewEntity> findByStoreNo(Long storeNo);

    // 특정 회원이 작성한 전체 리뷰 목록 조회
    List<ReviewEntity> findByMemberId(String memberId);

    // 특정 가게의 리뷰 중 사진이 첨부된 리뷰 목록 조회
    List<ReviewEntity> findByStoreNoAndReviewImageIsNotNull(Long storeNo);
}