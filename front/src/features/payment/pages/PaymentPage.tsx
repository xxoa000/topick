import PaymentForm from "../components/PaymentForm";
import s from "@/features/payment/pages/_payment-page.module.scss";

export default function PaymentPage() {
	
	return (
	<div className={s.page}>
		{/* <h3>결제하기</h3> */}
		<PaymentForm />
	</div>
	)
}