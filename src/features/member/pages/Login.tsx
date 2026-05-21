import { useEffect, useState } from "react";
import type { LoginResponseDTO } from "../types/loginResponseDTO" ;
import { getLoginResDto } from "../services/loginApi";


	
export function Login() {

	const [memberLogin, setMemberLogin] = useState<LoginResponseDTO[]>([]);
	const [errorMessage, setErrorMessage] = useState<string>("");

	// 호출된 api 가져오기
	useEffect (() => {
		getLoginResDto()
		.then((data) => {setMemberLogin(data);
		}).catch((error) => {
			console.error(error);
			setErrorMessage("회원목록을 불러오지 못했습니다.");
		});
	}, []);

	
	return (
	<>
		<h3>회원 정보</h3>
		{errorMessage && <p>errorMessage</p>}

		// 데이터를 html 로 출력
		{memberLogin.map((member) => (
			<div key={member.memberId}>
				<div>{member.memberId}</div>
				<div>{member.memberPw}</div>
				<div>{member.roleList}</div>
			</div>
		))}
	</>
	);
}//Login