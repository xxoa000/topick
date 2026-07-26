export type UpdateRequestDTO = {
  memberName : string;
	memberEmail : string;
	memberPhone? : string | null;
	memberGender? : "male" | "female" | "none";
	memberBirthday? : string | null;
}

export type UpdateResponseDTO = {
	memberId : string;
	//memberPw : string;

  memberName : string;
	memberEmail : string;
	memberPhone? : string | null;
	memberGender? : "male" | "female" | "none";
	memberBirthday? : string | null;
}