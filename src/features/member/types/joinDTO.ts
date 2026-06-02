
export type JoinAgreeData = {
	isAgree : boolean;
	ageCheck : boolean;
	isPrivacyAgree : boolean;
}



export type JoinRequestDTO {
	memberId: string;
	memberPw: string;

  memberName: string;
	memberEmail: string;
	memberPhone: string;
	memberGender: "male" | "female" | "none";
	memberBirthday: string;
}