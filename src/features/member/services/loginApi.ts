import { ENV } from "@/config/env";
import axios from "axios";

export const loginApi = async (memberId: string, memberPw: string) => {

	try {
		const response = await axios.post(
			ENV.API_BASE_URL+"/member/login",
			{
				memberId,
				memberPw
			},{
        withCredentials: true
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