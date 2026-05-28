import React, { useEffect, useState, useRef } from 'react';
import { useReview } from '../hooks/useReview'; 
import { ReviewComponent } from '../components/ReviewComponent'; 
import useCustomLogin from '@/hooks/useCustomLogin';
import { REVIEW_CONSTANTS } from '../constants/reviewConstant';
import styles from './review-page.module.scss'; 

interface ReviewPageProps {
  storeNo: number;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ storeNo }) => {
  const { member } = useCustomLogin();
  const { reviews, loading, getStoreReviewList, addReview, removeReview, updateReviewContent } = useReview();

  const [isPhotoOnly, setIsPhotoOnly] = useState<boolean>(false);
  const [starInput, setStarInput] = useState<number>(5);
  const [contentInput, setContentInput] = useState<string>('');

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (storeNo) {
      getStoreReviewList(storeNo, isPhotoOnly);
    }
  }, [storeNo, isPhotoOnly, getStoreReviewList]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);

      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contentInput.trim().length < REVIEW_CONSTANTS.MIN_CONTENT_LENGTH) {
      alert(`리뷰 내용을 최소 ${REVIEW_CONSTANTS.MIN_CONTENT_LENGTH}자 이상 작성해 주세요! (현재 ${contentInput.trim().length}자)`);
      return;
    }

    try {
      const success = await addReview(storeNo, starInput, contentInput, imageFiles);
      
      //백엔드 저장에 성공한 경우에만 초기화 및 DB 최신화 진행
      if (success) {
        setContentInput('');
        setStarInput(5);
        setImageFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 인풋 캐시 초기화
        
        // 오직 서버의 리얼 타임 상태만 믿고 깔끔하게 목록 갱신
        await getStoreReviewList(storeNo, isPhotoOnly);
      } else {
        alert("리뷰 등록에 실패. 서버 로그를 확인 요망");
      }
    } catch (error) {
      console.error("handleSubmit 실행 중 예외 발생:", error);
    }
  };

  return (
    <div className={styles.reviewPage}>
      {member?.memberId ? (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
          <h4>이 맛집은 어떠셨나요?</h4>
          <div className={styles.ratingSelect}>
            <label>별점 선택 : </label>
            <select value={starInput} onChange={(e) => setStarInput(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {'★'.repeat(num)} ({num}점)
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="맛, 분위기, 서비스 등 좋았던 점을 적어주세요!"
          />

          <div className={styles.uploadSection}>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className={styles.photoUploadBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              📷 사진 추가하기 ({imageFiles.length}장)
            </button>

            <div className={styles.previewContainer}>
              {previewUrls.map((url, index) => (
                <div key={url} className={styles.previewBox}>
                  <img src={url} alt="preview" />
                  <button 
                    type="button" 
                    className={styles.removePreviewBtn}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>리뷰 등록하기</button>
        </form>
      ) : (
        <div className={styles.loginGuide}>리뷰를 작성하려면 로그인이 필요합니다.</div>
      )}

      <div className={styles.listHeader}>
        <h3>리뷰 ({reviews.length}개)</h3>
        <label className={styles.photoToggle}>
          <input
            type="checkbox"
            checked={isPhotoOnly}
            onChange={(e) => setIsPhotoOnly(e.target.checked)}
          />
          <span>📸 포토 리뷰만 보기</span>
        </label>
      </div>

      {loading ? (
        <div className={styles.stateMessage}>불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.stateMessage}>아직 작성된 후기가 없습니다. 첫 후기를 남겨주세요!</div>
      ) : (
        <div className={styles.reviewContainer}>
          {reviews.map((item) => (
            <ReviewComponent
              key={item.reviewNo}
              review={item}
              onDelete={removeReview}
              onUpdate={updateReviewContent}
            />
          ))}
        </div>
      )}
    </div>
  );
};