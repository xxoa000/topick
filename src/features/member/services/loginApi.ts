import axios from "axios";
import type {LoginResponseDTO} from "../types/loginResponseDTO";

const BASE_URL = "http://localhost:8080/api";

export const getLoginResDto = async ():Promise<LoginResponseDTO[]> => {

	// const LoginData {
	// 	loginIdValue,
	// 	loginPwValue;
	// }

	try {
		const response = await axios.post<LoginResponseDTO[]>(
			BASE_URL+"/member/login",
			// LoginData,
			
		);
		return response.data;

	} catch(error) {
		if (axios.isAxiosError(error)) {
		alert(error.response?.status);
		}
		throw error;
	}

};