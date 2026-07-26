import accessApiClient from "@/config/axios";
import useCustomLogin from "@/hooks/useCustomLogin";
import { NavLink, useNavigate } from "react-router-dom";
import s from "@/features/member/components/_login-header.module.scss";
import { useFilterSearch } from '@/features/filter/context/FilterSearchContext';

export default function LoginHeader(){
  const { handleClear } = useFilterSearch();
  const navigate = useNavigate();
  const { member, logout, isLogin } = useCustomLogin();

  // 로그아웃 & 화면 새로고침
  const handleLogout = async() => {
    handleClear();
    
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
    {isLogin ?  <div className={s.login}><span className={s.pc}><b>{member?.memberName}</b> 님 환영합니다!</span>
                  <button type="button" onClick={handleLogout} className={s.btn}>
                    <span className={s.pc}>로그아웃</span>
                    <span className={s.mobile}><img src="/logout.png" alt="logout" /></span>
                  </button>
                  <button className={s.btn}><NavLink to='/my-info/update' onClick={handleClear}>
                    <span className={s.pc}>마이페이지</span>
                    <span className={s.mobile}>MY</span>
                  </NavLink></button>
                </div>
              : <div className={s.login}><button type="button" className={s.btn}><NavLink to='/member/login' onClick={handleClear}>로그인</NavLink></button></div> }
  </div>
  );
}//LoginHeader()