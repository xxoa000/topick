import { NavLink } from "react-router-dom"

export default function Header(){
  return (
    <>
      <table border={1}>
        <div>Header</div>
        <div><NavLink to='/myLocationSet'>내 위치 설정</NavLink></div>
        <div><NavLink to='/login'>로그인</NavLink></div>
        <div><NavLink to='/'>마이페이지</NavLink></div>
        <div><NavLink to='/'>홈</NavLink></div>
      </table>
    </>
  )
  
};
