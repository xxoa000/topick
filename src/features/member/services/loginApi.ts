import axios from "axios";
//import type {LoginRequestDTO, LoginResponseDTO} from "../types/loginResponseDTO";

const BASE_URL = "http://localhost:8080/api";

export const getLoginResDto = async (memberId: string, memberPw: string) => {

	try {
		const response = await axios.post(
			BASE_URL+"/member/login",
			{
				memberId,
				memberPw
			}
		);
		return response.data;

	} catch(error) {
		if (axios.isAxiosError(error)) {
		alert(error.response?.status);
		}
		throw error;
	}

};