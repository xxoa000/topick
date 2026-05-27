import { NavLink, useNavigate } from "react-router-dom"
import useCustomLogin from "@/hooks/useCustomLogin";
import accessApiClient from "@/config/axios";


export default function LoginHeader(){

  const navigate = useNavigate();
  const { member, logout, isLogin } = useCustomLogin();

  // 로그아웃 & 화면 새로고침
  const handleLogout = async() => {
    try {
      await accessApiClient.post( 
        "/member/logout",
        {
        }, {
          withCredentials: true
        }
      );
    } catch (error) {
      console.error(error); 
    } finally {
      logout();
      navigate("/");
    }
  }//handleLogout
  
  return (
  <>
    {isLogin ?  <div><b>{member?.memberName}</b> 님 환영합니다!&nbsp;&nbsp;
                  <button type="button" onClick={handleLogout}>로그아웃</button>
                  <button><NavLink to='/'>마이페이지</NavLink></button>
                </div>
              : <div><NavLink to='/member/login'>로그인</NavLink></div> }
  </>
  );
}//LoginHeader()