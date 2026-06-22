import { accessApiClient, publicApiClient }from '@/config/axios';
import type { Review } from '../types/reviewType';

export const reviewService = {
  
  //리뷰 등록
  createReview: async (reviewData: Review, imageFiles?: File[]): Promise<Review> => {
    const formData = new FormData();

    formData.append(
      'review',
      new Blob([JSON.stringify(reviewData)], { type: 'application/json' })
    );

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await accessApiClient.post<Review>('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  //리뷰 수정
  updateReview: async (
    reviewNo: number, 
    reviewData: Review, // 📌 Partial 제거하고 정형화된 Review 구조 전송
    currentMemberId: string,
    imageFiles?: File[]
  ): Promise<string> => {
    
    const formData = new FormData();

    formData.append(
      'review',
      new Blob([JSON.stringify(reviewData)], { type: 'application/json' })
    );

    // 💡 백엔드가 @RequestPart(value = "images") 리스트 파싱 에러를 내지 않도록 빈 값이라도 구조화
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await accessApiClient.put<string>(
      `/reviews/${reviewNo}`,
      formData,
      { 
        params: { currentMemberId },
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (reviewNo: number, currentMemberId: string): Promise<string> => {
    const response = await accessApiClient.delete<string>(`/reviews/${reviewNo}`, {
      params: { currentMemberId }
    });
    return response.data;
  },

  // 가게 리뷰 모아보기
  getStoreReviews: async (storeNo: number): Promise<Review[]> => {
    const response = await accessApiClient.get<Review[]>(`/reviews/store/${storeNo}`);
    return response.data;
  },

  // 내 리뷰 모아보기
  getMyReviews: async (memberId: string): Promise<Review[]> => {
    const response = await accessApiClient.get<Review[]>(`/reviews/member/${memberId}`);
    return response.data;
  },

  // 가게 포토리뷰 모아보기
  getPhotoReviews: async (storeNo: number): Promise<Review[]> => {
    const response = await accessApiClient.get<Review[]>(`/reviews/store/${storeNo}/photos`);
    return response.data;
  },

  //가게 평균 리뷰 보기
  getReviewTotal: async (storeNo: number): Promise<{avg: number, total: number}> => {
    const response = await publicApiClient.get<{avg: number, total: number}>(`/reviews/store/${storeNo}/total`);
    return response.data;
  }
};