// src/features/pick/components/PickComponent.tsx
import React from 'react';
import { usePick } from '../hooks/usePick';
import styles from './_pick-component.module.scss';

export const PickComponent: React.FC = () => {
  const {
    currentStep,  //현재 진행중인 단계 (1부터 시작)
    totalSteps,   //전체 단계 수 (질문의 갯수)
    currentQuestion,  //현재 단계의 질문 데이터 (질문 내용, 선택지 등)
    formData, //사용자가 지금까지 선택한 답변 데이터 객체
    recommendedMenus, //점수 상위 3개 음식 메뉴
    isLoading,  //결과 분석 중
    handleSelect, //선택지 클릭 시 답변을 저장
    handleNext, //'다음 단계' 또는 '결과 확인' 버튼 클릭
    handlePrev, //'이전 질문' 버튼 클릭
    handleReset //'다시 추천받기' 버튼 클릭 시, 상태 초기화
  } = usePick();

  //상단 진행바(퍼센트 계산)
  const progressPercent = (currentStep / totalSteps) * 100;

  // 1단계 ~ 6단계 질문 화면
  if (currentStep <= totalSteps && currentQuestion) {
    const currentSelectedValues = formData[currentQuestion.pickType];

    return (
      <div className={styles.pickContainer}>
        {/* 진행과정을 프로그래스바로 알려줌*/}
        <div className={styles.progressHeader}>
          <span className={styles.stepIndicator}>{currentStep} / {totalSteps}</span>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* 질문에 대한 보조 설명 */}
        <div className={styles.questionSection}>
          <h2 className={styles.mainQuestion}>{currentQuestion.question}</h2>
          <p className={styles.subText}>현재 상태를 골라주세요!</p>
        </div>

        {/* 정적 데이터 연동 선택지 리스트 */}
        <div className={styles.choiceList}>
          {currentQuestion.choices.map((choice) => {
            // 해당 버튼의 액티브 하이라이팅 유무 실시간 검사 (contains -> includes 수정 완료)
            const isSelected = currentQuestion.isMultiple
              ? (currentSelectedValues as string[]).includes(choice.value)
              : currentSelectedValues === choice.value;

            return (
              <button
                key={choice.value}
                type="button"
                className={`${styles.choiceButton} ${isSelected ? styles.active : ''}`}
                onClick={() => handleSelect(choice.value)}
              >
                {choice.label}
              </button>
            );
          })}
        </div>

        {/* 내비게이션 풋터 (하단 바 구역) */}
        <div className={styles.navigationFooter}>
          {currentStep > 1 ? (
            <button type="button" className={styles.prevButton} onClick={handlePrev}>
              〈 이전 질문으로
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            className={styles.nextButton}
            onClick={handleNext}
            disabled={currentQuestion.isMultiple ? false : !formData[currentQuestion.pickType]}
          >
            {currentStep === totalSteps ? '결과 확인하기 🎉' : '다음 단계 〉'}
          </button>
        </div>
      </div>
    );
  }

  // 7단계: 최종 취향 일치 음식 TOP 3 결과 스크린 레이아웃
  return (
    <div className={styles.pickContainer}>
      <div className={styles.resultSection}>
        <h2 className={styles.resultTitle}>오늘의 식당 Pick 결과!</h2>
        <p className={styles.resultSub}>고객님의 취향에 가장 고득점을 획득한 상위 3가지 추천 메뉴입니다.</p>

        {isLoading ? (
          <div className={styles.loadingSpinner}>알고리즘 분석 중...</div>
        ) : (
          <ul className={styles.menuResultList}>
            {recommendedMenus.map((menuName, idx) => (
              <li key={idx} className={styles.menuItem}>
                <span className={styles.rankBadge}>{idx + 1}위</span>
                <strong className={styles.foodNameText}>{menuName}</strong>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className={styles.resetButton} onClick={handleReset}>
          🔄 다시 추천받기
        </button>
      </div>
    </div>
  );
};