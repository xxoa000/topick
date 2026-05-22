import { NavLink, useNavigate } from "react-router-dom"
import { getSessionData, SESSION } from "@/config/constant";


export default function LoginHeader(){

  const navigate = useNavigate();
  
  // 로그인 상태인지 확인
  const member = getSessionData();
  const isLogin = member !== null;

  // 로그아웃 & 화면 새로고침
  const handleLogout = () => {
    sessionStorage.removeItem(SESSION.ACCESS_DATA);
    navigate("/");
  }
  return (
  <>
    {isLogin ?  <div><b>{member.memberName}</b> 님 환영합니다!&nbsp;&nbsp;
                  <button type="button" onClick={handleLogout}>로그아웃</button>
                  <button><NavLink to='/'>마이페이지</NavLink></button>
                </div>
              : <div><NavLink to='/login'>로그인</NavLink></div> }
  </>
  );
}