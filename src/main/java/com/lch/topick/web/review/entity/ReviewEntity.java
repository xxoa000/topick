package com.lch.topick.web.review.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * review 테이블과 1:1로 매핑되는 객체
 */
@Entity
@Table(name = "review")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_no")
    private Long reviewNo; // 리뷰 고유 번호 (PK)

    @Column(name = "member_id", nullable = false)
    private String memberId; // 작성자 ID

    @Column(name = "store_no", nullable = false)
    private Long storeNo; // 가게 고유 번호

    @Column(name = "review_star", nullable = false, columnDefinition = "TINYINT")
    private int reviewStar; // 별점 (1~5)

    @Column(name = "review_content", nullable = false, columnDefinition = "TEXT")
    private String reviewContent; // 리뷰 내용

    @Column(name = "review_create_at", nullable = false, updatable = false)
    private LocalDateTime reviewCreateAt; // 리뷰 생성일

    @Column(name = "review_update_at", insertable = false, updatable = false)
    private LocalDateTime reviewUpdateAt; //리뷰 수정일

    @Column(name = "review_image")
    private String reviewImage; // 업로드된 이미지 파일명

    //persistence context에 처음 저장되기 직전에 실행되어 생성일을 기록
    @PrePersist
    public void prePersist() {
        this.reviewCreateAt = LocalDateTime.now();
    }
}