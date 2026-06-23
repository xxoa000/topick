import React, { useState } from 'react'; 
import type { Review } from '../types/reviewType';
import { REVIEW_ALERT_MESSAGES } from '../constants/reviewConstant';
import styles from './_review-component.module.scss'; 
import useCustomLogin from '@/hooks/useCustomLogin';

interface ReviewComponentProps {
  review: Review;
  currentMemberId?: string;
  onDelete: (reviewNo: number) => Promise<boolean>;
  onUpdate: (reviewNo: number, content: string) => Promise<boolean>; // 💡 수정 처리용 함수 추가
}

export const ReviewComponent: React.FC<ReviewComponentProps> = ({ review, onDelete, onUpdate }) => {
  const { member } = useCustomLogin();
  const isAuthor = !!(member?.memberId && review.memberId === member.memberId);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(review.reviewContent);

  const handleDeleteClick = async () => {
    if (review.reviewNo && window.confirm(REVIEW_ALERT_MESSAGES.CONFIRM_DELETE)) {
      await onDelete(review.reviewNo);
    }
  };

  const handleUpdateClick = async () => {
    if (!review.reviewNo) return;
    
    if (!editContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (review.reviewContent !== editContent) {
      const success = await onUpdate(review.reviewNo, editContent);
      if (success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{review.memberId}</span>
          <span className={styles.stars}>
            {'★'.repeat(review.reviewStar)}{'☆'.repeat(5 - review.reviewStar)}
          </span>
        </div>
        <span className={styles.date}>
          {review.reviewCreateAt ? new Date(review.reviewCreateAt).toLocaleDateString() : ''}
        </span>
      </div>

      {review.reviewImage && (
        <div className={styles.imageContainer}>
          <img 
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/reviews/${review.reviewImage}`} 
            alt="리뷰 이미지" 
          />
        </div>
      )}

      {isEditing ? (
        <div className={styles.editForm}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={styles.editTextarea}
          />
          <div className={styles.editActions}>
            <button onClick={handleUpdateClick} className={styles.saveButton}>완료</button>
            <button onClick={() => { setIsEditing(false); setEditContent(review.reviewContent); }} className={styles.cancelButton}>취소</button>
          </div>
        </div>
      ) : (
        <p className={styles.content}>{review.reviewContent}</p>
      )}

      {isAuthor && !isEditing && (
        <div className={styles.authorActions}>
          <button className={styles.editButton} onClick={() => setIsEditing(true)}>수정</button>
          <button className={styles.deleteButton} onClick={handleDeleteClick}>삭제</button>
        </div>
      )}
    </div>
  );
};