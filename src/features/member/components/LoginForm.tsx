import { useState } from "react";
import { loginApi } from "../services/loginApi";
import { NavLink, useNavigate } from "react-router-dom";


export default function LoginForm() {

	const navigate = useNavigate();

	const [memberId, setMemberId] = useState("");
	const [memberPw, setMemberPw] = useState("");
	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		try {
			const data = await loginApi(memberId, memberPw);
			console.log(data);
			sessionStorage.setItem("memberIsLogin", JSON.stringify(data));
			navigate("/");
		} catch(err) {
			console.error(err);
		}
	}


	return (
	<div>
	<form onSubmit={handleSubmit}>
		<table>
		<tbody>
			<tr>
				<th>ID</th>
				<td><input type="text" id="memberId" name="memberId" 
						value={memberId} onChange={(e) => setMemberId(e.target.value)}/>
				</td>
			</tr>
			<tr>
				<th>PW</th>
				<td><input type="password" id="memberPw" name="memberPw" 
						value={memberPw} onChange={(e) => setMemberPw(e.target.value)}/>
				</td>
			</tr>
			<tr>
				<th></th>
				<td><button type="submit">로그인</button></td>
			</tr>
		</tbody>
		</table>
		<div><NavLink to="">아이디 찾기</NavLink></div>
		<div><NavLink to="">PW 찾기</NavLink></div>
		<div><NavLink to="/join">회원가입</NavLink></div>
	</form>
	</div>
	);
};