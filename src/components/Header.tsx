import { NavLink } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";
import useCustomLogin from "@/hooks/useCustomLogin";
import {FilterHomePage } from '../features/filter';

export default function Header(){
  // 로그인 확인 (zustand 전역으로 관리)
  const { isLogin } = useCustomLogin();

  console.log(`isLogin: ${isLogin}`);

  return (
    <header>
      <div><NavLink to='/'>홈</NavLink></div>
      {isLogin ? <div><NavLink to='/my-location-set'>내 위치 설정</NavLink></div> 
               : <div><NavLink to='/member/login'>내 위치 설정</NavLink></div> }
      <div><NavLink to='filter'>검색창</NavLink></div>
      <LoginHeader />
    
    </header>
  );
}
