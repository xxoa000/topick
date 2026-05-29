import { NavLink, useLocation } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";
import useCustomLogin from "@/hooks/useCustomLogin";

export default function Header(){
  // 로그인 확인 (zustand 전역으로 관리)
  const { isLogin } = useCustomLogin();

  console.log(`isLogin: ${isLogin}`);

  const location = useLocation();
  const isFilterPage =
    location.pathname === '/filter' || location.pathname.startsWith('/filter/');

  return (
    <header>
      <div><NavLink to='/'>홈</NavLink></div>
      {isLogin ? <div><NavLink to='/my-location-set'>내 위치 설정</NavLink></div> 
               : <div><NavLink to='/member/login'>내 위치 설정</NavLink></div> }

      {isFilterPage ? (
        <div id="food-type-slot" />
      ) : (
        <div>
          <NavLink to="/filter">맛집찾기</NavLink>
        </div>
      )}
      <LoginHeader />
    
    </header>
  );
}
