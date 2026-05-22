import { NavLink } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";

export default function Header(){
  return (
    <header>
      <div><NavLink to='/'>홈</NavLink></div>
      <div><NavLink to='/myLocationSet'>내 위치 설정</NavLink></div>
      <div><NavLink to='/'>검색창</NavLink></div>
      <LoginHeader />
    
    </header>
  );
}
