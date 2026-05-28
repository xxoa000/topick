import accessApiClient, { refreshApiClient } from "@/config/axios";
import type { LoginRequestDTO } from "@member/types/loginDTO";


const memberApi = {

	// 로그인
	login: async(requestDto: LoginRequestDTO) => {
		const response = await refreshApiClient.post( "/member/login", requestDto );
		return response.data;
	},
	// 로그아웃
	logout: async() => {
		const response = await accessApiClient.post( "/member/logout" );
		return response.data;
	},
	// accessToken 재발급
	reissue: async() => {
		const response = await refreshApiClient.post( "/auth/refresh" );
		return response.data;
	}


	// 내 정보 조회

	// 내 정보 수정

	// 회원 탈퇴

}

export default memberApi;
