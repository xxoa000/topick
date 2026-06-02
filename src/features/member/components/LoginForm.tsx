import { useState } from "react";
import styles from "./_login-form.module.scss";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "@/hooks/useCustomLogin";
import memberApi from "@member/services/memberApi";


export default function LoginForm() {
	const navigate = useNavigate();
	const { login } = useCustomLogin();
	const [memberId, setMemberId] = useState("");
	const [memberPw, setMemberPw] = useState("");

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		try {
			const data = await memberApi.login({memberId, memberPw});
			// 로그인 성공시, 세션스토리지 & zustandStore 에 accessToken 저장
			login(data);
			// 로그인 성공시 홈으로 url 이동
			navigate("/");

		} catch(error) {
			console.error(error);
			alert("로그인 실패");
		}
	} //handleSubmit


	return (
	<>

		<form onSubmit={handleSubmit} className={styles.loginForm}>

			<div className={styles.formBox}>
				<div className={styles.inputBox}>
					<label htmlFor="memberId">아이디</label>
					<input type="text" id="memberId" name="memberId"
						value={memberId} onChange={(e) => setMemberId(e.target.value)}/>
				</div>

				<div className={styles.inputBox}>
					<label htmlFor="memberPw">비밀번호</label>
					<input type="password" id="memberPw" name="memberPw"
						value={memberPw} onChange={(e) => setMemberPw(e.target.value)}/>
				</div>
			</div>

			<button type="submit" className={styles.loginButton}>로그인</button>
		</form>
	
	</>
	);
};