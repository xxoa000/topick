package com.lch.topick.web.review.domain;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDomain {
    private Long reviewNo;      	 		// 리뷰 고유 번호
    private String memberId;    	 		// 작성자 ID
    private Long storeNo;       	 		// 가게 고유 번호
    private int reviewStar;     	 		// 별점
    private String reviewContent; 			// 리뷰 내용
    private LocalDateTime reviewCreateAt; 	// 리뷰 작성일자
    private String reviewImage;  			// 이미지 파일명
}