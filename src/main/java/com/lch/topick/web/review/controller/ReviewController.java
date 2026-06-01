package com.lch.topick.web.review.controller;

import com.lch.topick.web.review.domain.ReviewDomain;
import com.lch.topick.web.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // 💡 이미지 파일 처리를 위해 필수 추가

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 1. 리뷰 등록 (텍스트 JSON + 사진 파일 함께 받기)
     * POST /api/reviews
     * consumes 설정을 통해 JSON 데이터와 파일 데이터가 동시에 들어옴을 명시합니다.
     */
    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ReviewDomain> createReview(
            @RequestPart("review") ReviewDomain domain, // 💡 프론트엔드의 'review' Blob 데이터와 매핑
            @RequestPart(value = "images", required = false) List<MultipartFile> files // 💡 프론트엔드의 'images' 파일 데이터와 매핑 (사진은 필수 아님)
    ) {
        // 백엔드 Service 구현 시 registerReview 메서드가 MultipartFile 리스트도 함께 받도록 확장해야 합니다.
        ReviewDomain savedReview = reviewService.registerReview(domain, files);
        return ResponseEntity.ok(savedReview);
    }

    /**
     * 2. 리뷰 수정 (텍스트 JSON + 수정/추가된 사진 파일 함께 받기)
     * PUT /api/reviews/{reviewNo}
     */
    @PutMapping(value = "/{reviewNo}", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateReview(
            @PathVariable("reviewNo") Long reviewNo,
            @RequestPart("review") ReviewDomain domain, // 💡 @RequestBody에서 @RequestPart로 변경
            @RequestPart(value = "images", required = false) List<MultipartFile> files, // 💡 수정 시 새로 업로드한 이미지들
            @RequestParam("currentMemberId") String currentMemberId) {
        
        domain.setReviewNo(reviewNo);
        
        // 백엔드 Service 구현 시 modifyReview 메서드에 파일 리스트 파라미터를 추가해야 합니다.
        String result = reviewService.modifyReview(domain, files, currentMemberId);
        
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