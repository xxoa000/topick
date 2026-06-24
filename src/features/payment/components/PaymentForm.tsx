import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { PaymentRequestDTO } from "../types/paymentDTO";
import paymentApi from "../services/paymentApi";
import axios from "axios";
import { useEffect, useState } from "react";
import { orderApi } from "@/features/order/services/orderApi";
import type { OrderListResponseDTO } from "@/features/order/types/orderDTO";
import s from "@/features/payment/components/_payment-form.module.scss";

export default function PaymentForm() {
  const navigate = useNavigate();
  const { orderListNo }  = useParams();
  const [ order, setOrder ] = useState<OrderListResponseDTO | null>(null);

  useEffect(() => {
    // 에러 방지
    if (!orderListNo) return;

    const fetchOrder = async () => {
      const data = await orderApi.selectOne(Number(orderListNo));
      console.log("주문 data:", data);
      setOrder(data);
    }
    fetchOrder();
  }, [orderListNo]);

	const {
		register,
		handleSubmit,
		//formState: {errors},
	}=useForm<PaymentRequestDTO>();

	const handlePayment = async(data:PaymentRequestDTO) => {
    if (!order ) return;
    const paymentMethod = data.paymentMethod || "direct";

    const paymentData:PaymentRequestDTO = {
      orderListNo : order.orderListNo,
	    paymentMethod,
      paymentPrice : Number(order.orderListFinalPrice),
	    paymentTid : `MOCK-TID-${paymentMethod.toLocaleUpperCase()}-${order.orderListNo}`
    }

		try {
			await paymentApi.ready(paymentData);
      console.log("결제 data: ",paymentData);
			alert("모의 결제 완료, 테스트에 참가해 주셔서 감사합니다.");
			navigate("/my-info/order");

		} catch(error) {
			if (!axios.isAxiosError(error)) {
				console.error(error);
				return;
			}
		}
	};

  // 에러 방지
  if (!order) return (<div>주문 정보를 불러오는 중입니다...</div>);


  return (
  <>
  <form onSubmit={handleSubmit(handlePayment)} className={s.paymentForm}>

    <section className={s.orderSection}>
      <h3>주문 상품</h3>
      {order.detailList?.map((det) => (
        <div key={det.orderDetailNo} className={s.orderItem}>
          <span className={s.menuName}>{det.orderDetailMenuName}</span>
          <span className={s.amount}>{det.orderDetailAmount}</span>
          <span className={s.price}>{det.orderDetailTodayPrice.toLocaleString()}원</span>
        </div>
      ))}
      <div className={s.row}>
      <label>결제 방법</label>
      <div className={s.typeRow}>
        <label className={s.radio}>
          <input type="radio" value="direct" {...register("paymentMethod")} />무통장입금
        </label>
        <label className={s.radio}>
          <input type="radio" value="card" {...register("paymentMethod")} />카드결제
        </label>
        <label className={s.radio}>
          <input type="radio" value="kakao" {...register("paymentMethod")} />카카오pay
        </label>
      </div>
    </div>
      <button type="submit">모의결제하기</button>
    </section>
    
    <aside key={order.orderListNo} className={s.visitAside}>
      <h3>방문 정보</h3>
      <div className={s.infoRow}>
        <label>식당</label><span>{order.orderStoreName}</span>
      </div>
      <label>방문일시</label><span>{order.orderListVisitTime.replace("T", " ")}</span>
      <label>방문타입</label><span>{order.orderListVisitType}</span>
      <h3>총 결제 금액</h3>
      <div className={s.priceBox}>
        <div className={s.priceRow}><span>{order.orderListTotalPrice?.toLocaleString()}원</span></div>
        <div className={s.priceRow}><span>{order.orderListFinalPrice?.toLocaleString()}원</span></div>
      </div>
      
    </aside>
  </form>
  </>
  );
}