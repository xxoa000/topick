import { useState } from "react";
import { useNavigate } from "react-router-dom";
import memberApi from "../services/memberApi";
import { useForm } from "react-hook-form";

export default function JoinForm() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);

	const [memberId, setMemberId] = useState("");
	const [memberPw, setMemberPw] = useState("");
	const [memberName, setMemberName] = useState("");
	const [memberEmail, setMemberEmail] = useState("");
	const [memberPhone, setMemberPhone] = useState("");
	const [memberGender, setMemberGender] = useState("");
	const [memberBirthday, setMemberBirthday] = useState("");
	const [idCheck, setIdCheck] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState : { isSubmitting, error }
	} = useForm ({
		mode : "onChange",
		reValidateMode : "onChange"
	});



	// 약관 동의사항 & 만 14세 이상 확인
	const handleAgreeCheck = async(e: React.SyntheticEvent) => {
		e.preventDefault();
		setStep(2);
	}



	// 클라이언트 -> 서버로 아이디 중복 확인 요청
	const handleIdCheck = async(e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			const data = await memberApi.idCheck(memberId);

			if (!data) {
				alert("이미 존재하는 ID 입니다.");
				setMemberId("");
				return;
			}
			alert("사용 가능한 아이디 입니다.");
			setIdCheck(true);
			setStep(3);
		
		} catch(error) {
			console.error(error);
		}

		
		
	}//handleIdCheck

	const handleJoin = async(e: React.SyntheticEvent) => {
		e.preventDefault();

		// 아이디 중복확인 했는지 체크
		if (!idCheck) {
			alert("아이디 중복확인을 해주세요.");
			return;
		}

		try {
			await memberApi.join({memberId, memberPw, memberName, memberEmail, memberPhone, memberGender, memberBirthday});
			// 회원가입 성공시, 서버로 보내서 DB 에 insert

			// 회원가입 성공시 로그인 페이지로 이동
			navigate("/member/login");

		} catch(error) {
			console.error(error);
			alert("회원가입 실패");
		}
	}//handleJoin


	return (
	<>
	{/* 14세 이상 체크 & 약관동의 */}
	{ step === 1 &&
		<form onSubmit ={handleAgreeCheck}>
			<div>
				<p>약관 동의 사항.
					해당 약관에 동의하십니까?</p><br/>
				동의 <input type="radio" value="Y" className="isAgree"/>&nbsp;&nbsp;
				비동의 <input type="radio" value="N" className="isAgree"/>
			</div><br/>
			<div>
				<p>만 14세 이상입니까?</p><br/>
				만 14세 이상 <input type="radio" value="Y" className="ageCheck"/>&nbsp;&nbsp;
				만 14세 미만 <input type="radio" value="N" className="ageCheck"/>
			</div><br/>
			<button type="submit">확인</button>
		</form>
	}

	{/* 아이디 중복 체크 */}
	{ step === 2 && 
		<form onSubmit={handleIdCheck}>
				<div>
						<label htmlFor="memberId">아이디</label>
						<input type="text" id="memberId" name="memberId" value={memberId} 
							onChange={(e) => {
								setMemberId(e.target.value);
								setIdCheck(false);
							}
						}/>
						<button type="submit">중복확인</button>
				</div>
		</form>
	}
	
	{/* 비밀번호 확인 */}
	{ step === 3 &&
		<form>
			
		</form>
	}


	{/* 이메일 인증 */}
	{ step === 4 &&
		<form>

		</form>
	}


	{/* 성별, 생일, 전화번호 등 기본정보 작성 */}
	{ step === 5 &&
		<form onSubmit={handleJoin}>
			<div>

				<button type="submit">회원가입</button>
			</div>
		</form>
	}
	
	</>
	)
} //JoinForm