package com.lch.topick.web.review.service;

import com.lch.topick.web.review.domain.ReviewDomain;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

public interface ReviewService {

	// 새로운 리뷰 등록(C)
	ReviewDomain registerReview(ReviewDomain domain, List<MultipartFile> files);

	// 기존 리뷰 수정(U)
	String modifyReview(ReviewDomain domain, List<MultipartFile> files, String currentMemberId);

	// 기존 리뷰 삭제(D)
	String removeReview(Long reviewNo, String currentMemberId);

	// 특정 가게의 리뷰 목록 모아보기(R)
	List<ReviewDomain> getReviewListByStore(Long storeNo);

	// 내가 작성한 리뷰 모아보기(R)
	List<ReviewDomain> getMyReviewList(String memberId);

	// 특정 가게의 이미지 리뷰 모아보기(R)
	List<ReviewDomain> getPhotoReviewList(Long storeNo);

	// 특정 가게의 전체 리뷰 정보
	Map<String, Object> findReviewStatsByStoreNo(Long storeNo);
}
