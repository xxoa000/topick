import { useNavigate } from "react-router-dom";
import { useJoinStepStore } from "../hooks/joinStepStore";
import JoinIdCheckForm from "./JoinIdCheckForm";
import JoinAgreeForm from "./JoinAgreeForm";
import memberApi from "../services/memberApi";
import type { JoinRequestDTO } from "../types/joinDTO";
import { useForm } from "react-hook-form";
import styles from "@member/components/_join-form.module.scss";


export default function JoinForm() {
	const navigate = useNavigate();
	const step = useJoinStepStore((state) => state.step);


	const {
		handleSubmit,
	} = useForm<JoinRequestDTO>();
		

	const handleJoin = async(data:JoinRequestDTO) => {
		try {
			await memberApi.join(data);
			// 회원가입 성공시, 서버로 보내서 DB 에 insert

			// 회원가입 성공시 로그인 페이지로 이동
			navigate("/member/login");

		} catch(error) {
			console.error(error);
			alert("회원가입 실패");
		}
	}


	return (
	<main className={styles.joinForm}>
	{/* 14세 이상 체크 & 약관동의 */}
	{ step === 1 && <JoinAgreeForm /> }

	{/* 회원정보 입력 */}
	{/* 아이디 중복 체크 */}
	{/* 비밀번호 확인 */}
  {/* 이메일 인증 */}
  {/* 선택 정보 입력 */}
	{ step === 2 && <JoinIdCheckForm /> }


	{/* 회원가입 완료 */}
	{ step === 3 &&
		<form onSubmit={handleSubmit(handleJoin)}>
			<div>
				<button type="submit">회원가입</button>
			</div>
		</form>
	}
	
	</main>
	);
} //JoinForm