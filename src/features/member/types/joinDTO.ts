
// zustand 단계, 상태 관리 용 메서드
export type JoinStepState = {
	isCheck : boolean;
	setIsCheck : (checked:boolean) => void;
	
	step : number;
	setStep : (step:number) => void;

	resetState : () => void;
};


// 클라이언트 내부 화면입력/검증용 DTO
export type JoinFormDTO = JoinRequestDTO & {
	isAgree : boolean;
	ageCheck : boolean;
	isPrivacyAgree : boolean;

	pwCheck? : string;
}

// 클라이언트 -> 서버로 보내는 데이터
export type JoinRequestDTO = {
	memberId : string;
	memberPw : string;

  memberName : string;
	memberEmail : string;
	memberPhone? : string | null;
	memberGender? : "male" | "female" | "none";
	memberBirthday? : string | null;
}