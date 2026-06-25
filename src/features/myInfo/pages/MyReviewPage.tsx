// src/features/myInfo/pages/MyReviewPage.tsx
import React, { useEffect, useState } from 'react';
import { useReview } from '../../review/hooks/useReview'; 
import { ReviewComponent } from '../../review/components/ReviewComponent'; 
import { useStore } from "@/features/store/hooks/useStore"; // 💡 가게 정보 조회를 위해 useStore 훅 임포트
import s from './_my-review-page.module.scss'; 

export default function MyReviewPage() {
  const { 
    reviews, 
    loading: reviewLoading, 
    getMyReviewList, 
    updateReviewContent, 
    removeReview 
  } = useReview();

  const { getStoreData } = useStore(); // 💡 가게 데이터를 원격에서 동적 로드할 함수 꺼내기
  const [isNamesLoading, setIsNamesLoading] = useState(false);

  // 1. 페이지가 열리면 내 리뷰 목록 조회
  useEffect(() => {
    getMyReviewList();
  }, [getMyReviewList]);

  // 2. 💡 [핵심] 리뷰 목록을 가져온 후, 로컬스토리지에 이름이 없는 가게들을 API로 동적 조회해서 채워 넣습니다.
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const fetchMissingStoreNames = async () => {
      setIsNamesLoading(true);
      
      // 중복된 storeNo 제거하여 효율적으로 조회할 목록 추출
      const uniqueStoreNos = Array.from(new Set(reviews.map(item => item.storeNo)));

      for (const storeNo of uniqueStoreNos) {
        // 이미 브라우저가 이름을 기억하고 있다면 API 요청을 건너뜁니다.
        if (localStorage.getItem(`store_name_${storeNo}`)) continue;

        try {
          // StorePage에서 쓰던 인프라 조회 API 그대로 활용 (좌표 x, y, 카카오 id가 없어도 번호 기반 조회가 가능하도록 백엔드가 설계되어 있다면 작동합니다)
          // 만약 파라미터 개수가 안 맞으면 기존 getStoreData 스펙에 맞게 dummy 값을 넣어줍니다.
          const res = await getStoreData(storeNo, "", "", "");
          
          // API 응답 구조에서 가게 이름(placeName)을 추출해 로컬스토리지에 캐싱합니다.
          // useStore 내부 구조나 백엔드 반환값에 맞춰 가게명 세팅을 진행합니다.
          if (res && res.storeDetails?.summary?.placeName) {
            localStorage.setItem(`store_name_${storeNo}`, res.storeDetails.summary.placeName);
          } else if (res && res.placeName) {
            localStorage.setItem(`store_name_${storeNo}`, res.placeName);
          }
        } catch (err) {
          console.error(`가게 번호 ${storeNo} 이름 조회 실패:`, err);
        }
      }
      setIsNamesLoading(false);
    };

    fetchMissingStoreNames();
  }, [reviews, getStoreData]);

  // 리뷰 삭제 처리 연동
  const handleDeleteReview = async (reviewNo: number): Promise<boolean> => {
    const success = await removeReview(reviewNo);
    if (success) {
      alert("리뷰가 삭제되었습니다.");
    }
    return success;
  };

  // 리뷰 수정 처리 연동
  const handleUpdateReview = async (reviewNo: number, content: string): Promise<boolean> => {
    const success = await updateReviewContent(reviewNo, content);
    if (success) {
      alert("리뷰가 수정되었습니다.");
    }
    return success;
  };

  // 전체 로딩 상태 정의
  if (reviewLoading || isNamesLoading) {
    return <div className={s.loading}>리뷰 및 맛집 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className={s.myReviewSection}>
      <h2>내가 작성한 리뷰 ({reviews.length}개)</h2>
      <hr />
      
      {reviews.length === 0 ? (
        <div className={s.emptyMessage}>아직 작성하신 리뷰가 없습니다.</div>
      ) : (
        <div>
          {reviews.map((item) => {
            // 이제 기존 리뷰들도 위에서 실행된 API 덕분에 이름을 스토리지에서 꺼내올 수 있게 됩니다!
            const cachedStoreName = localStorage.getItem(`store_name_${item.storeNo}`);

            return (
              <div key={item.reviewNo} style={{ marginBottom: '32px' }}>
                <div className={s.storeTitleBadge}>
                  📍 {cachedStoreName || `맛집 번호: ${item.storeNo}`}
                </div>

                <ReviewComponent
                  review={item}
                  onDelete={handleDeleteReview}
                  onUpdate={handleUpdateReview}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}