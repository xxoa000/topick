import accessApiClient, { publicApiClient, refreshApiClient } from "@/config/axios";
import type { LoginRequestDTO } from "@member/types/loginDTO";
import type { JoinRequestDTO } from "../types/joinDTO";


const memberApi = {


	// 아이디 중복 확인
	idCheck: async(memberId: string):Promise<boolean> => {
		const response = await publicApiClient.get( `/member/idCheck/${memberId}`);
		return response.data;
	},

	// 회원가입
	join: async(joinReqDto : JoinRequestDTO) => {
		const response = await publicApiClient.post( "/member/join", joinReqDto );
		console.log(`response.data: ${response.data}`);
		alert(response.data);
		return response.data;
	},

	// 로그인
	login: async(loginReqDto: LoginRequestDTO) => {
		const response = await refreshApiClient.post( "/member/login", loginReqDto );
		return response.data;
	},
	// 로그아웃
	logout: async() => {
		const response = await refreshApiClient.post( "/member/logout" );
		return response.data;
	},
	// accessToken 재발급
	reissue: async() => {
		const response = await refreshApiClient.post( "/auth/refresh" );
		return response.data;
	},


	// 내 정보 조회

	// 내 정보 수정

	// 회원 탈퇴

}

export default memberApi;
