import s from "@/components/_footer.module.scss";
// import { NavLink } from "react-router-dom";

export default function Footer(){
  return (
    <footer className={s.footer}>
      {/* <div className={styles.row}>
          <NavLink to="/"><span className={s.homeLink}>오늘의 식당</span></NavLink>
          <NavLink to=""><span className={s.link}>서비스소개</span></NavLink>&nbsp;
          <NavLink to=""><span className={s.link}>이용약관</span></NavLink>
          <NavLink to=""><span className={s.link}>개인정보처리방침</span></NavLink>
          <NavLink to=""><span className={s.link}>고객센터</span></NavLink>
      </div> */}
      <div className={s.row}>
          <b>(주)오늘의 식당</b> 대표: 이하정<br/>
          이용약관 개인정보처리방침 제휴문의 고객센터 0000-0000<br/><br/><hr/><br/>
          <span className={s.service}>Copyright GC COMPANY Corp. All rights reserved.</span>
      </div>
    </footer>
  );
}