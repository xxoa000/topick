import { useState } from "react";


export default function LoginForm() {

	const [memberId, setMemberId] = useState("");
	const [memberPw, setMemberPw] = useState("");
	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();

		// input value 확인용
		console.log("아이디:", memberId);
		console.log("비밀번호:", memberPw);
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
	</form>
	</div>
	);
};