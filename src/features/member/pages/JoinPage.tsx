import { useEffect } from "react";
import JoinForm from "../components/JoinForm";
import { useCustomJoin } from "../hooks/useCustomJoin";
import styles from "@member/pages/_join-page.module.scss";

    
export default function JoinPage() {
  const { step, resetState } = useCustomJoin();

  // 회원가입 page 를 벗어나는 경우 step:1 로 초기화
  useEffect(() => {
    return () => { resetState(); }
    }, [resetState]
  );

  return (
  <main className={styles.joinPage}>
    <header className={styles.joinHeader}>
      <h2>회원가입</h2>
    </header>
    
    <aside className={styles.stepBox}>
      <span className={step==1 ? styles.activeStep : styles.step }>약관 동의</span>
      <span className={step==2 ? styles.activeStep : styles.step }>회원정보 입력</span>
      <span className={step==3 ? styles.activeStep : styles.step }>가입 완료</span>
    </aside>
  
    <section className={styles.formSection}>
      <JoinForm />
    </section>
  </main>

  );
}//LoginPage