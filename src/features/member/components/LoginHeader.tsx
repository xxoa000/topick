import accessApiClient from "@/config/axios";
import useCustomLogin from "@/hooks/useCustomLogin";
import { NavLink, useNavigate } from "react-router-dom";
import s from "@/features/member/components/_login-header.module.scss";


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
  <div className={s.btnBox}>
    {isLogin ?  <div className={s.login}><span><b>{member?.memberName}</b> 님 환영합니다!</span>
                  <button type="button" onClick={handleLogout} className={s.btn}>로그아웃</button>
                  <button className={s.btn}><NavLink to='/my-info/food-log'>마이페이지</NavLink></button>
                </div>
              : <button type="button" className={s.btn}><NavLink to='/member/login'>로그인</NavLink></button> }
  </div>
  );
}//LoginHeader()