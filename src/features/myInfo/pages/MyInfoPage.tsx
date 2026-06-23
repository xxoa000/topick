import useCustomLogin from "@/hooks/useCustomLogin";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import s from "@/features/myInfo/pages/_my-info-page.module.scss";
import MyUpdatePage from "./MyUpdatePage";
import MyOrderPage from "./MyOrderPage";
import MyReviewPage from "./MyReviewPage";
import MyResignPage from "./MyResignPage";
import MyFoodLogPage from "./MyFoodLogPage";

export default function MyInfoPage() {
	const navigate = useNavigate();
  const { member, isLogin } = useCustomLogin();

	if (!isLogin) {
		alert("로그인이 필요합니다.");
		navigate("/member/login");
	}

	return (
	<main className={s.page}>
		<nav className={s.left}>
			<div><span><b>{member?.memberName}</b> 님</span></div>
			<ul>
				<li><NavLink to='/my-info/food-log'>푸드 로그</NavLink></li>
				<li><NavLink to='/my-info/update'>내 정보 수정</NavLink></li>
				<li><NavLink to='/my-info/order'>주문 내역</NavLink></li>
				<li><NavLink to='/my-info/review'>내 리뷰 보기</NavLink></li>
				<li><NavLink to='/my-info/resign'>회원 탈퇴</NavLink></li>
			</ul>
		</nav>
		<section className={s.right}>
			<Routes>
        <Route path="food-log/*" element={<MyFoodLogPage />} />
        <Route path="update/*" element={<MyUpdatePage />} />
        <Route path="order/*" element={<MyOrderPage />} />
        <Route path="review/*" element={<MyReviewPage />} />
        <Route path="resign/*" element={<MyResignPage />} />
      </Routes>
		</section>
	</main>
	)
} //MyInfoPage