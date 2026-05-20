package com.lch.topick.web.review.controller;

import com.lch.topick.web.review.domain.ReviewDomain;
import com.lch.topick.web.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 1. 리뷰 등록
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<ReviewDomain> createReview(@RequestBody ReviewDomain domain) {
        ReviewDomain savedReview = reviewService.registerReview(domain);
        return ResponseEntity.ok(savedReview);
    }

    /**
     * 2. 리뷰 수정
     * PUT /api/reviews/{reviewNo}
     */
    @PutMapping("/{reviewNo}")
    public ResponseEntity<?> updateReview(
            @PathVariable("reviewNo") Long reviewNo,
            @RequestBody ReviewDomain domain,
            @RequestParam("currentMemberId") String currentMemberId) {
        
        domain.setReviewNo(reviewNo);
        String result = reviewService.modifyReview(domain, currentMemberId);
        
        if (result.startsWith("NOT_FOUND")) {
            return ResponseEntity.status(404).body("존재하지 않거나 이미 삭제된 리뷰입니다.");
        }
        if (result.startsWith("FORBIDDEN")) {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }
        
        return ResponseEntity.ok("리뷰가 수정되었습니다.");
    }

    /**
     * 3. 리뷰 삭제
     * DELETE /api/reviews/{reviewNo}
     */
    @DeleteMapping("/{reviewNo}")
    public ResponseEntity<?> deleteReview(
            @PathVariable("reviewNo") Long reviewNo,
            @RequestParam("currentMemberId") String currentMemberId) {
        
        String result = reviewService.removeReview(reviewNo, currentMemberId);
        
        if (result.startsWith("NOT_FOUND")) {
            return ResponseEntity.status(404).body("존재하지 않거나 이미 삭제된 리뷰입니다.");
        }
        if (result.startsWith("FORBIDDEN")) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }
        
        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
    }

    /**
     * 4. 가게별 리뷰 모아보기
     * GET /api/reviews/store/{storeNo}
     */
    @GetMapping("/store/{storeNo}")
    public ResponseEntity<List<ReviewDomain>> getStoreReviews(
            @PathVariable("storeNo") Long storeNo) {
        List<ReviewDomain> reviews = reviewService.getReviewListByStore(storeNo);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 5. 내 리뷰 모아보기
     * GET /api/reviews/member/{memberId}
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ReviewDomain>> getMyReviews(
            @PathVariable("memberId") String memberId) {
        List<ReviewDomain> reviews = reviewService.getMyReviewList(memberId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 6. 포토 리뷰만 모아보기
     * GET /api/reviews/store/{storeNo}/photos
     */
    @GetMapping("/store/{storeNo}/photos")
    public ResponseEntity<List<ReviewDomain>> getPhotoReviews(
            @PathVariable("storeNo") Long storeNo) {
        List<ReviewDomain> reviews = reviewService.getPhotoReviewList(storeNo);
        return ResponseEntity.ok(reviews);
    }
}