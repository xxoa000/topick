import styles from "@/components/_footer.module.scss";
import { NavLink } from "react-router-dom";

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
          <NavLink to="/"><span className={styles.homeLink}>오늘의 식당</span></NavLink>
          <NavLink to=""><span className={styles.link}>서비스소개</span></NavLink>&nbsp;
          <NavLink to=""><span className={styles.link}>이용약관</span></NavLink>
          <NavLink to=""><span className={styles.link}>개인정보처리방침</span></NavLink>
          <NavLink to=""><span className={styles.link}>고객센터</span></NavLink>
      </div>
      <div className={styles.row}>
          <b>(주)오늘의 식당</b> 대표: 이하정<br/>
          이용약관 개인정보처리방침 제휴문의 고객센터 0000-0000<br/><br/>
          <span className={styles.service}>Copyright GC COMPANY Corp. All rights reserved.</span>
      </div>
    </footer>
  );
}