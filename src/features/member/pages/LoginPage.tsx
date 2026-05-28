import LoginForm from "../components/LoginForm";
import styles from "@member/pages/_login-page.module.scss";
	
export default function LoginPage() {
	return (
	<main className={styles.loginPage}>
		<LoginForm />
	</main>
	);
}//LoginPage