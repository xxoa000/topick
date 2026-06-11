import { NavLink } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";
import useCustomLogin from "@/hooks/useCustomLogin";
import KeywordSearchBar from "@/features/filter/components/KeywordSearchBar";
import styles from "@/components/_header.module.scss";

export default function Header(){
  const { isLogin } = useCustomLogin();

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logoLink}>
        <img src="/logo_1.png" alt="오늘의 식당 로고" />
  	  </NavLink>
      {isLogin ? <div><NavLink to='/my-location-set'>내 위치 설정</NavLink></div> 
               : <div><NavLink to='/member/login'>내 위치 설정</NavLink></div> }

      <div id="food-type-slot">
        <KeywordSearchBar />
      </div>
      <LoginHeader />
    
    </header>
  );
}
