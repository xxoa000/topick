package com.lch.topick.web.review.controller;

import com.lch.topick.web.review.domain.ReviewDomain;
import com.lch.topick.web.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 1. 리뷰 등록 (텍스트 JSON + 사진 파일 함께 받기)
     * POST /api/reviews
     * 서비스에서 금지어로 인해 IllegalArgumentException이 던져지면 400 에러를 반환
     */
    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createReview(
            @RequestPart("review") ReviewDomain domain, 
            @RequestPart(value = "images", required = false) List<MultipartFile> files 
    ) {
        try {
            ReviewDomain savedReview = reviewService.registerReview(domain, files);
            return ResponseEntity.ok(savedReview);
        } catch (IllegalArgumentException e) {
            // 💡 서비스 레이어의 checkBlockWords에서 던진 금지어 경고 메시지를 프론트엔드로 400 Bad Request와 함께 전송
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 2. 리뷰 수정 (텍스트 JSON + 수정/추가된 사진 파일 함께 받기)
     * PUT /api/reviews/{reviewNo}
     * 서비스로부터 "BLOCKED_WORD"를 응답받으면 400 에러를 반환
     */
    @PutMapping(value = "/{reviewNo}", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateReview(
            @PathVariable("reviewNo") Long reviewNo,
            @RequestPart("review") ReviewDomain domain, 
            @RequestPart(value = "images", required = false) List<MultipartFile> files, 
            @RequestParam("currentMemberId") String currentMemberId) {
        
        domain.setReviewNo(reviewNo);
        
        String result = reviewService.modifyReview(domain, files, currentMemberId);
        
        // 수정하려는 본문에 금지어가 섞여 있을 때 예외 처리
        if ("BLOCKED_WORD".equals(result)) {
            return ResponseEntity.badRequest().body("비속어 및 금지어가 포함되어 있어 리뷰를 수정할 수 없습니다.");
        }
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