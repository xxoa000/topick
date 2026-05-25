export interface LoginRequestDTO {
	memberId: string;
	memberPw: string;
}

export interface LoginResponseDTO {
	memberId: string;
	memberName: string;
	accessToken: string;
	roleList: string[]; 
}