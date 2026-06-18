import { NavLink, useLocation } from "react-router-dom"
import LoginHeader from "../features/member/components/LoginHeader";
import useCustomLogin from "@/hooks/useCustomLogin";
import KeywordSearchBar from "@/features/filter/components/KeywordSearchBar";
import s from "@/components/_header.module.scss";
import { useFilterSearch } from '@/features/filter/context/FilterSearchContext';

export default function Header(){
  const { isLogin } = useCustomLogin();
  const location = useLocation();
  
  const { handleClear } = useFilterSearch();
  return (
    <header className={s.header}>
      <NavLink to="/" className={s.logoLink} onClick={handleClear}>
        <img src="/logo_1.png" alt="오늘의 식당 로고" />
  	  </NavLink>

      {isLogin ? (
        <div>
          <NavLink to='/my-location-set' state={{ backgroundLocation: location }}>
            내 위치 설정
          </NavLink>
        </div> 
      ) : (
        <div>
          <NavLink to='/member/login'>내 위치 설정</NavLink>
        </div>
      )}
      
      <div id="food-type-slot">
        <KeywordSearchBar />
      </div>
      <LoginHeader />
    
    </header>
  );
}
