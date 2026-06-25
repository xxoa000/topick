import s from "@/features/myInfo/pages/_my-food-log-page.module.scss";

export default function MyFoodLogPage() {

	return (
  <section className={s.page}>
  <header className={s.header}>
    <h3>내 외식 기록</h3>
    <p>한 달간의 외식 기록을 한 눈에 확인해 보세요</p>
  </header>

  <article className={s.chartArea}>
    <div className={s.emptyChart}>
      월별 외식 통계 차트
    </div>
  </article>

  <aside className={s.summary}>
    <h4>이번 달 외식 요약</h4>

    <div className={s.card}>
      <span>총 방문 횟수</span>
      <strong>12회</strong>
    </div>

    <div className={s.card}>
      <span>총 사용 금액</span>
      <strong>186,000원</strong>
    </div>

    <div className={s.card}>
      <span>가장 많이 주문한 메뉴</span>
      <strong>제육볶음</strong>
    </div>
  </aside>

  <footer className={s.rank}>
    <h4>자주 방문한 식당 TOP 3</h4>

    <div>
      <span>🥇</span>
      <p>오늘의 국밥</p>
      <strong>8회 방문</strong>
    </div>

    <div>
      <span>🥈</span>
      <p>미금 돈카츠</p>
      <strong>6회 방문</strong>
    </div>

    <div>
      <span>🥉</span>
      <p>마라공방</p>
      <strong>4회 방문</strong>
    </div>
  </footer>
</section>
  );
}