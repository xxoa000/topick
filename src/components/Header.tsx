import { NavLink } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";
import useCustomLogin from "@/hooks/useCustomLogin";
import styles from "@/components/_header.module.scss";

export default function Header(){
  // 로그인 확인 (zustand 전역으로 관리)
  const { isLogin } = useCustomLogin();

  console.log(`isLogin: ${isLogin}`);

  return (
    <header>
      <NavLink to="/" className={styles.logoLink}>
        <img src="/logo.png" alt="오늘의 식당 로고" />
  	  </NavLink>
      {isLogin ? <div><NavLink to='/my-location-set'>내 위치 설정</NavLink></div> 
               : <div><NavLink to='/member/login'>내 위치 설정</NavLink></div> }
      <div><NavLink to='/filter'>검색창</NavLink></div>
      <LoginHeader />
    
    </header>
  );
}
