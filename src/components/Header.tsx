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
<<<<<<< HEAD
      {isFilterPage ? (
        <div id="food-type-slot" />
      ) : (
        <div>
          <NavLink to="/filter">맛집찾기</NavLink>
        </div>
      )}
=======
      <div><NavLink to='/filter'>검색창</NavLink></div>
>>>>>>> f99184af45f96881a9718db3d3c0732e0e25ab2f
      <LoginHeader />
    
    </header>
  );
}
