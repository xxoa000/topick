import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useCustomJoin } from "../hooks/joinStepStore";

import memberApi from "../services/memberApi";
import type { JoinFormDTO } from "../types/joinDTO";
import styles from "@member/components/_join-form.module.scss";

import JoinIdCheckForm from "./JoinIdCheckForm";
import JoinAgreeForm from "./JoinAgreeForm";
import JoinPwCheckForm from "./JoinPwCheckForm";
import JoinInfoForm from "./JoinInfoForm";
import axios from "axios";

/* 
	react-hook-form 을 사용하기 위한 기본 설정

	register : 등록
		required : 맞는 값이 들어와야만 submit, 아닐시 message 띄움
	handleSubmit : form submit 버튼
	watch : 입력값을 실시간 감지
	form state : form 상태관리
	errors : 에러 관리
		formState.isSubmitting : 제출 중 상태
		formState.errors → 에러 상태

	mode 종류
	- reValidateMode : (submit 에 이한)에러 이후 다시 검증하는 시점
		onSubmit : 아무 설정 없을시 default, 처음엔 검증 안함, submit 시 전체 검증, 이후부턴 변경시 재검증
		onChange : 입력할 때 마다 바로 검증, 첫 입력부터 에러 표시, 실시간 검증
		onBlur : FocusOut 시 검증
		all : change+blur 모두 검증, 가장 적극적인 검증방식
*/

export default function JoinForm() {
	const navigate = useNavigate();
	const { step } = useCustomJoin();

	// react-hook-form 설정 (부모 컴포넌트용)
	const joinMethod = useForm<JoinFormDTO>({
		mode: "onChange",
		//fromData 지만 서버론 보내지 않는다는 의미, 단계 이동시에도 값 저장됨
		shouldUnregister : false,
		defaultValues : {
			//memberGender: "none",
			isAgree : false,
			isPrivacyAgree : false,
			ageCheck : false
		}
	});

	// 구조분해
	const { setError, handleSubmit } = joinMethod;
		


	const handleJoin = async(data:JoinFormDTO) => {
		// 서버로 보낼때 제외할 data 분리
		const {
			isAgree,
			isPrivacyAgree,
			ageCheck,
			pwCheck,
			...joinData
		} = data;

		// "" 값 방지용, 선택사항을 선택하지 않은 경우엔 null 전송
		const requestData = {
			...joinData,
			memberPhone : joinData.memberPhone?.trim() ? joinData.memberPhone : null,
			memberBirthday : joinData.memberBirthday || null,
		}

    try {
			await memberApi.join(requestData);
			// 회원가입 성공시, 서버로 보내서 DB 에 insert
			console.log(joinData);

			// 회원가입 성공시 로그인 페이지로 이동
			navigate("/member/login");

    } catch(error) {
			if (!axios.isAxiosError(error)) {
				console.error(error);
				return;
			}
			const errorName = error.response?.data?.name;
			const errorMessage = error.response?.data?.message;

			// 상황별 errorCode 정리
			if (errorName=="MEMBER_ID_EXIST") {
				setError("memberId", {
						type: "server",
						message: errorMessage
					});
			} else if (errorName=="MEMBER_EMAIL_EXIST") {
				setError("memberEmail", {
						type: "server",
						message: errorMessage
					});
			} else if (errorName=="MEMBER_PHONE_EXIST") {
				setError("memberPhone", {
						type: "server",
						message: errorMessage
					});
			}
					

			alert("회원가입 실패");
		}
	}


	return (
	<FormProvider {...joinMethod}>
		<form onSubmit={handleSubmit(handleJoin)} className={styles.joinForm}>
		{/* 14세 이상 체크 & 약관동의 */}
		{ step === 1 && <JoinAgreeForm /> }

		{/* 회원정보 입력 */}
		{/* 아이디 중복 체크 */}
		{/* 비밀번호 확인 */}
		{/* 이메일 인증 */}
		{/* 선택 정보 입력 */}
		{ step === 2 &&
			<>
			<JoinIdCheckForm />
			<JoinPwCheckForm />
			<JoinInfoForm />
			</>
		}


		{/* 회원가입 완료 */}
		{/* { step === 3 &&
			<form onSubmit={handleSubmit(handleJoin)}>
				<div>
					<button type="submit">회원가입</button>
				</div>
			</form>
		} */}
		</form>
	</FormProvider>
	);
} //JoinForm