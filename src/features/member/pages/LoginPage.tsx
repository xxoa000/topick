import { NavLink } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import styles from "@member/pages/_login-page.module.scss";
	
export default function LoginPage() {
	return (

		<main className={styles.loginMain}>
		<NavLink to="/" className={styles.logoLink}>
			<img src="/logo_2.png" alt="오늘의 식당 로고" />
  	</NavLink>

		<LoginForm />

		<ul className={styles.linkList}>
			{/* <li><NavLink to="">아이디 찾기</NavLink></li>
			<li><NavLink to="">PW 찾기</NavLink></li> */}
			<li><NavLink to="/member/join">회원가입</NavLink></li>
		</ul>
		</main>
	);
}//LoginPage