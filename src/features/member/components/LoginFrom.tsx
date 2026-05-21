import { useState } from "react";


export function LoginForm() {
	// const loginIdValue:string = "";
	// const loginPwValue:string = "";

	const [loginIdValue, setLoginIdValue] = useState("");
	const [loginPwValue, setLoginPwValue] = useState("");


	return (
	<form action="/loginForm" method="POST">
		<table>
			<tr>
				<th>ID</th>
				<td><input type="text" id="loginId" name="loginId" 
						value={loginIdValue} onChange={(e) => setLoginIdValue(e.target.value)}/></td>
			</tr>
			<tr>
				<th>PW</th>
				<td><input type="password" id="loginPw" name="loginPw" 
						value={loginPwValue} onChange={(e) => setLoginPwValue(e.target.value)}/></td>
			</tr>
			<tr>
				<td><button type="submit">로그인</button>
				</td><td><button type="reset">취소</button></td>
			</tr>
		</table>
	</form>
	);
};