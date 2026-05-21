package com.lch.topick.web.review.service;

import com.lch.topick.web.review.domain.ReviewDomain;
import com.lch.topick.web.review.entity.ReviewEntity;
import com.lch.topick.web.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    /**
     * 새로운 리뷰 등록
     */
    @Override
    @Transactional
    public ReviewDomain registerReview(ReviewDomain domain) {
        ReviewEntity entity = ReviewEntity.builder()
                .memberId(domain.getMemberId())
                .storeNo(domain.getStoreNo())
                .reviewStar(domain.getReviewStar())
                .reviewContent(domain.getReviewContent())
                .reviewImage(domain.getReviewImage())
                .build();

        ReviewEntity savedEntity = reviewRepository.save(entity);
        return convertToDomain(savedEntity);
    }

    /**
     * 리뷰 수정
     * - 작성자만 리뷰 수정 가능
     */
    @Override
    @Transactional
    public String modifyReview(ReviewDomain domain, String currentMemberId) {
        ReviewEntity entity = reviewRepository.findById(domain.getReviewNo()).orElse(null);
        
        //수정하려는 글이 존재하지 않는 경우
        if (entity == null) {
            return "NOT_FOUND: 해당 리뷰가 존재하지 않습니다.";
        }
        
        //요청한 사람과 작성자가 다른 경우
        if (!entity.getMemberId().equals(currentMemberId)) {
            return "FORBIDDEN: 작성자가 아니므로 권한이 없습니다.";
        }
        
        //데이터 수정 (JPA 변경 감지로 자동 UPDATE)
        entity.setReviewStar(domain.getReviewStar());
        entity.setReviewContent(domain.getReviewContent());
        entity.setReviewImage(domain.getReviewImage());
        
        return "SUCCESS: 리뷰가 수정되었습니다.";
    }
    /**
     * 리뷰 삭제
     * - 작성자만 리뷰 삭제 가능
     */
    @Override
    @Transactional
    public String removeReview(Long reviewNo, String currentMemberId) {
        ReviewEntity entity = reviewRepository.findById(reviewNo).orElse(null);
        
        //삭제하려는 글이 존재하지 않는 경우
        if (entity == null) {
            return "NOT_FOUND: 해당 리뷰가 존재하지 않습니다.";
        }
        
        //요청한 사람과 작성자가 다른 경우
        if (!entity.getMemberId().equals(currentMemberId)) {
            return "FORBIDDEN: 작성자가 아니므로 권한이 없습니다.";
        }
        
        //진짜 DB에서 삭제
        reviewRepository.delete(entity);
        return "SUCCESS: 리뷰가 삭제되었습니다.";
    }

    /**
     * 특정 가게의 모든 리뷰 모아보기
     */
    @Override
    public List<ReviewDomain> getReviewListByStore(Long storeNo) {
        return reviewRepository.findByStoreNo(storeNo).stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }

    /**
     * 내 리뷰 모아보기
     */
    @Override
    public List<ReviewDomain> getMyReviewList(String memberId) {
        return reviewRepository.findByMemberId(memberId).stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }

    /**
     * 특정 가게의 포토 리뷰 모아보기
     */
    @Override
    public List<ReviewDomain> getPhotoReviewList(Long storeNo) {
        return reviewRepository.findByStoreNoAndReviewImageIsNotNull(storeNo).stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }

    //Entity → Domain
    private ReviewDomain convertToDomain(ReviewEntity entity) {
        return ReviewDomain.builder()
                .reviewNo(entity.getReviewNo())
                .memberId(entity.getMemberId())
                .storeNo(entity.getStoreNo())
                .reviewStar(entity.getReviewStar())
                .reviewContent(entity.getReviewContent())
                .reviewCreateAt(entity.getReviewCreateAt())
                .reviewImage(entity.getReviewImage())
                .build();
    }
}