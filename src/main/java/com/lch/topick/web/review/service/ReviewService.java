package com.lch.topick.web.review.service;

import com.lch.topick.web.review.domain.ReviewDomain;
import java.util.List;

public interface ReviewService {
    
    // 새로운 리뷰 등록(C)
    ReviewDomain registerReview(ReviewDomain domain);
    
    // 기존 리뷰 수정(U) - 수정 요청자와 원본 작성자가 같은지 확인
    String modifyReview(ReviewDomain domain, String currentMemberId);
    
    // 기존 리뷰 삭제(D) - 수정 요청자와 원본 작성자가 같은지 확인
    String removeReview(Long reviewNo, String currentMemberId);

    // 특정 가게의 리뷰 목록 모아보기(R)
    List<ReviewDomain> getReviewListByStore(Long storeNo);

    // 내가 작성한 리뷰 모아보기(R)
    List<ReviewDomain> getMyReviewList(String memberId);

    // 특정 가게의 이미지 리뷰 모아보기(R)
    List<ReviewDomain> getPhotoReviewList(Long storeNo);
}