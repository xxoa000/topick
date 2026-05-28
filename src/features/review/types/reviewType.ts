export interface Review {
  reviewNo?: number;           // 리뷰 고유 번호
  memberId: string;            // 작성자 ID
  storeNo: number;             // 가게 고유 번호
  reviewStar: number;          // 별점 (1~5)
  reviewContent: string;       // 리뷰 내용
  reviewCreateAt?: string;     // 리뷰 작성일자
  reviewUpdateAt?: string | null; //리뷰 수정일자
  reviewImage?: string | null; // 이미지 파일명
}