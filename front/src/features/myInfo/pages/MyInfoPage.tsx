import useCustomLogin from "@/hooks/useCustomLogin";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import s from "@/features/myInfo/pages/_my-info-page.module.scss";
import MyUpdatePage from "./MyUpdatePage";
import MyOrderPage from "./MyOrderPage";
import MyReviewPage from "./MyReviewPage";
import MyResignPage from "./MyResignPage";
import MyOrderDetailPage from "./MyOrderDetailPagem";

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
			<div className={s.profileBox}>
				<span><b>{member?.memberName}</b> 님</span>
				<span className={s.roleBadge}>
					{member?.roleList?.includes("ADMIN")
						? "관리자" : member?.roleList?.includes("OWNER")
						? "점주" : member?.roleList?.includes("MEMBER")
						? "회원" : ""}
				</span>
			</div>
		
			<ul>
				<li><NavLink to='/my-info/update'>내 정보 수정</NavLink></li>
				<li><NavLink to='/my-info/order'>주문 내역</NavLink></li>
				<li><NavLink to='/my-info/review'>내 리뷰 보기</NavLink></li>
				<li><NavLink to='/my-info/resign'>회원 탈퇴</NavLink></li>
			</ul>
		</nav>
		<section className={s.right}>
			<Routes>
        <Route path="update/*" element={<MyUpdatePage />} />
        <Route path="order/*" element={<MyOrderPage />} />
        <Route path="order/detail/:orderListNo" element={<MyOrderDetailPage />} />
        <Route path="review/*" element={<MyReviewPage />} />
        <Route path="resign/*" element={<MyResignPage />} />
      </Routes>
		</section>
	</main>
	)
} //MyInfoPage