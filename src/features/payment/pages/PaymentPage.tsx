import { useForm } from "react-hook-form";
import type { PaymentRequestDTO } from "../types/paymentDTO";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import paymentApi from "../services/paymentApi";

export default function PaymentPage() {
	const navigate = useNavigate();

	const {
		//register,
		handleSubmit,
		//formState: {errors},
	}=useForm<PaymentRequestDTO>();

	const handlePayment = async(data:PaymentRequestDTO) => {
		try {
			await paymentApi.ready(data);
			alert("모의 결제 완료, 테스트에 참가해 주셔서 감사합니다.");
			navigate("/");
		} catch(error) {
			if (!axios.isAxiosError(error)) {
				console.error(error);
				return;
			}
		}
	};

	return (
	<div>
		<h3>결제하기</h3>
		<form onSubmit={handleSubmit(handlePayment)}>
			<div>
				결제창 구현 중...
			</div>
			<button type="submit">모의결제하기</button>
		</form>
	</div>
	)
}