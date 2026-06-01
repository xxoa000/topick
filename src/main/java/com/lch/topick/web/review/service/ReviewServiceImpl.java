package com.lch.topick.web.review.service;

import com.lch.topick.web.review.domain.ReviewDomain;
import com.lch.topick.web.review.entity.ReviewEntity;
import com.lch.topick.web.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    // 💡 프로젝트 내부의 static 폴더 하위에 이미지가 저장되도록 설정된 경로입니다.
    private final String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/reviews/";

    /**
     * 1. 리뷰 등록 (파일 업로드 + 실제 DB 저장 구현 완료)
     */
    @Override
    public ReviewDomain registerReview(ReviewDomain domain, List<MultipartFile> files) {
        
        String savedFileName = null;

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        File folder = new File(uploadDir);
                        if (!folder.exists()) {
                            folder.mkdirs();
                        }

                        String originalName = file.getOriginalFilename();
                        String uuid = UUID.randomUUID().toString();
                        String extension = originalName.substring(originalName.lastIndexOf("."));
                        savedFileName = uuid + extension;

                        File targetFile = new File(uploadDir + savedFileName);
                        file.transferTo(targetFile);

                        break; 
                    } catch (IOException e) {
                        System.err.println("❌ 백엔드 파일 서버 저장 중 오류 발생: " + e.getMessage());
                        throw new RuntimeException("파일 업로드 실패", e);
                    }
                }
            }
        }

        ReviewEntity entity = ReviewEntity.builder()
                .memberId(domain.getMemberId())
                .storeNo(domain.getStoreNo())
                .reviewStar(domain.getReviewStar())
                .reviewContent(domain.getReviewContent())
                .reviewImage(savedFileName) 
                .build();

        ReviewEntity savedEntity = reviewRepository.save(entity);
        
        return convertToDomain(savedEntity); 
    }

    /**
     * 2. 리뷰 수정 구현 완료
     */
    @Override
    public String modifyReview(ReviewDomain domain, List<MultipartFile> files, String currentMemberId) {
        ReviewEntity entity = reviewRepository.findById(domain.getReviewNo()).orElse(null);
        
        if (entity == null) return "NOT_FOUND";
        if (!entity.getMemberId().equals(currentMemberId)) return "FORBIDDEN";

        entity.setReviewStar(domain.getReviewStar());
        entity.setReviewContent(domain.getReviewContent());

        if (files != null && !files.isEmpty() && !files.get(0).isEmpty()) {
            try {
                // 기존 이미지가 존재했다면 디스크에서 먼저 삭제 처리하여 낭비 방지
                if (entity.getReviewImage() != null) {
                    File oldFile = new File(uploadDir + entity.getReviewImage());
                    if (oldFile.exists()) oldFile.delete();
                }

                String originalName = files.get(0).getOriginalFilename();
                String savedFileName = UUID.randomUUID().toString() + originalName.substring(originalName.lastIndexOf("."));
                files.get(0).transferTo(new File(uploadDir + savedFileName));
                entity.setReviewImage(savedFileName);
            } catch (IOException e) {
                throw new RuntimeException("수정 중 파일 업로드 실패", e);
            }
        }

        return "SUCCESS";
    }

    /**
     * 3. 리뷰 삭제 구현 완료
     */
    @Override
    public String removeReview(Long reviewNo, String currentMemberId) {
        ReviewEntity entity = reviewRepository.findById(reviewNo).orElse(null);
        if (entity == null) return "NOT_FOUND";
        if (!entity.getMemberId().equals(currentMemberId)) return "FORBIDDEN";

        if (entity.getReviewImage() != null) {
            File file = new File(uploadDir + entity.getReviewImage());
            if (file.exists()) file.delete();
        }

        reviewRepository.delete(entity);
        return "SUCCESS";
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDomain> getReviewListByStore(Long storeNo) {
        List<ReviewEntity> entities = reviewRepository.findByStoreNo(storeNo);
        return entities.stream().map(this::convertToDomain).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDomain> getMyReviewList(String memberId) {
        List<ReviewEntity> entities = reviewRepository.findByMemberId(memberId);
        return entities.stream().map(this::convertToDomain).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDomain> getPhotoReviewList(Long storeNo) {
        List<ReviewEntity> entities = reviewRepository.findByStoreNoAndReviewImageIsNotNull(storeNo);
        return entities.stream().map(this::convertToDomain).toList();
    }

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