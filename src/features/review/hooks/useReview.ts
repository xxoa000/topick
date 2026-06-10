import { useState, useCallback } from 'react';
import type { Review } from '../types/reviewType';
import { reviewService } from '../services/reviewService';
import useCustomLogin from '@/hooks/useCustomLogin';

export const useReview = () => {
  const { member } = useCustomLogin();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. 가게 리뷰 목록 조회
  const getStoreReviewList = useCallback(async (storeNo: number, isPhotoOnly = false) => {
    setLoading(true);
    try {
      const data = isPhotoOnly 
        ? await reviewService.getPhotoReviews(storeNo)
        : await reviewService.getStoreReviews(storeNo);
      setReviews(data);
    } catch (err) {
      console.error('가게 리뷰 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. 내 리뷰 목록 조회
  const getMyReviewList = useCallback(async () => {
    if (!member?.memberId) return;
    setLoading(true);
    try {
      const data = await reviewService.getMyReviews(member.memberId);
      setReviews(data);
    } catch (err) {
      console.error('내 리뷰 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [member]);

  // 3. 신규 리뷰 등록
  const addReview = async (storeNo: number, reviewStar: number, reviewContent: string, imageFiles?: File[]) => {
    if (!member?.memberId) {
      alert('로그인이 필요한 기능입니다.');
      return false;
    }
    
    try {
      const reviewPayload: Review = {
        memberId: member.memberId,
        storeNo,
        reviewStar,
        reviewContent
      };

      const newReview = await reviewService.createReview(reviewPayload, imageFiles);
      return !!newReview;
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        // "금지어가 포함되어 있어 리뷰를 등록할 수 없습니다." 경고창 출력
        alert(err.response.data); 
      } else {
        alert('리뷰 등록 중 에러가 발생했습니다.');
      }
      console.error('리뷰 등록 실패:', err);
      return false;
    }
  };

  // 4. 기존 리뷰 수정
  const updateReviewContent = async (reviewNo: number, reviewContent: string) => {
    if (!member?.memberId) return false;
    
    const targetReview = reviews.find((r) => r.reviewNo === reviewNo);
    if (!targetReview) return false;

    try {
      const updatePayload: Review = {
        ...targetReview,
        reviewContent: reviewContent
      };

      const result = await reviewService.updateReview(reviewNo, updatePayload, member.memberId);
      
      if (result === "SUCCESS" || result.includes("수정되었습니다")) {
        setReviews((prev) =>
          prev.map((r) => (r.reviewNo === reviewNo ? { ...r, reviewContent } : r))
        );
        return true;
      }
      return false;
    } catch (err: any) {
      // 백엔드 Controller에서 ResponseEntity.badRequest().body(...)로 던진 400 에러 캐치
      if (err.response && err.response.status === 400) {
        // "비속어 및 금지어가 포함되어 있어 리뷰를 수정할 수 없습니다." 경고창 출력
        alert(err.response.data); 
      } else if (err.response && err.response.status === 403) {
        alert('수정 권한이 없습니다.');
      } else {
        alert('리뷰 수정 중 에러가 발생했습니다.');
      }
      console.error('리뷰 수정 실패:', err);
      return false;
    }
  };

  // 5. 리뷰 삭제
  const removeReview = async (reviewNo: number) => {
    if (!member?.memberId) return false;
    try {
      await reviewService.deleteReview(reviewNo, member.memberId);
      setReviews((prev) => prev.filter((r) => r.reviewNo !== reviewNo));
      return true;
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      return false;
    }
  };

  return { 
    reviews, 
    loading, 
    getStoreReviewList, 
    getMyReviewList, 
    addReview, 
    removeReview, 
    updateReviewContent
  };
};