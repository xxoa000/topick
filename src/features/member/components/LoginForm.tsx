import styles from "./_login-form.module.scss";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "@/hooks/useCustomLogin";
import memberApi from "@member/services/memberApi";
import type { LoginRequestDTO } from "../types/loginDTO";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function LoginForm() {
	const navigate = useNavigate();
	const { login } = useCustomLogin();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	}=useForm<LoginRequestDTO>();

	const loginValidate = {
			required: "아이디와 비밀번호를 정확히 입력해 주세요."
	};

	const handleLogin = async (reqDto:LoginRequestDTO) => {
		try {
			const data = await memberApi.login(reqDto);
			// 로그인 성공시, 세션스토리지 & zustandStore 에 accessToken 저장
			login(data);
			// 로그인 성공시 홈으로 url 이동
			navigate("/");

		} catch(error) {
			// axios 에러가 아니라면 여기서 return
			if (!axios.isAxiosError(error)) {
				console.error(error);
				return;
			}
			// axios 에러
			const errorName = error.response?.data?.name;
			const errorMessage = error.response?.data?.message;

			// ?? : Nullish Coalescing Operator(널 병합 연산자), null 이나 undefined 일 경우 오른쪽 값 사용
			if (errorName === "LOGIN_FAILED") {
				setError("root", {
				type: "server",
				message: errorMessage ?? "아이디 또는 비밀번호가 잘못 되었습니다."
				})
			}
		}
	} //handleSubmit


	return (
	<>

		<form onSubmit={handleSubmit(handleLogin)} className={styles.loginForm}>

			<div className={styles.formBox}>
				<div className={styles.inputBox}>
					<label htmlFor="memberId">아이디
						<input type="text" id="memberId" {...register("memberId",loginValidate)}/>
					</label>
				</div>

				<div className={styles.inputBox}>
					<label htmlFor="memberPw">비밀번호
						<input type="password" id="memberPw" {...register("memberPw",loginValidate)}/>
					</label>
				</div>
			</div>
			<span className={styles.message}>
				{errors.root?.message || errors.memberId?.message || errors.memberPw?.message }
			</span>
			<button type="submit" className={styles.loginButton}>로그인</button>
		</form>
	
	</>
	);
}