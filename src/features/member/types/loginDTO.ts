export interface LoginRequestDTO {
	memberId: string;
	memberPw: string;
}

export interface LoginResponseDTO {
	memberId: string;
	memberPw: string;
	roleList: string[]; 
}