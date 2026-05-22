import { NavLink } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";

export default function Header(){
  const memberIsLogin = sessionStorage.getItem("memberIsLogin");
	const member = memberIsLogin ? JSON.parse(memberIsLogin) : null;
  const isLogin = member !== null;

  return (
    <header>
      <div><NavLink to='/'>홈</NavLink></div>
      {isLogin ? <div><NavLink to='/myLocationSet'>내 위치 설정</NavLink></div> : <div><NavLink to='/login'>내 위치 설정</NavLink></div> }
      <div><NavLink to='/'>검색창</NavLink></div>
      <LoginHeader />
    
    </header>
  );
}
