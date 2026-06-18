import type { OrderCreateRequestDTO } from "../types/orderDTO";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { orderApi } from "../services/orderApi";
import s from "@/features/order/components/_orderForm.module.scss";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "@/hooks/useCustomLogin";

export default function OrderForm() {
  const {
    register,
    handleSubmit,
    watch,
  }=useFormContext<OrderCreateRequestDTO>();

  const navigate = useNavigate();
  const { isLogin } = useCustomLogin();

  // 총 금액 계산
  const detailList = watch("detailList") ?? [];
  const totalPrice = detailList.reduce( (sum,m) => {
    return sum + m.menuPrice * m.orderDetailAmount;
  },0);


  const handleOrderCreate = async (data:OrderCreateRequestDTO) => {
    console.log("submitData: ",data);
    if (!isLogin) {
      alert("먼저 로그인을 해주세요.");
      navigate("/member/login");
      return;
    }
    try {
      await orderApi.create(data);
      console.log("order result: ",data);
      
      alert("주문완료, 결제창으로 넘어갑니다.");
      navigate("/payment");

    } catch(error) {
      if (!axios.isAxiosError(error)) {
				console.error(error);
				return;
			}
    }
  }



  return (
  <form onSubmit={handleSubmit(handleOrderCreate)} className={s.form}>
    <div className={s.row}>
      <label>방문일시<span className={s.required}>*</span></label>
        <input type="datetime-local" {...register("orderListVisitTime")}></input>
    </div>
    
    <div className={s.row}>
      <label>방문타입<span className={s.required}>*</span></label>
      <div className={s.typeRow}>
        <label className={s.radio}>
          <input type="radio" value="visit" {...register("orderListVisitType")} />매장 식사
        </label>
        <label className={s.radio}>
          <input type="radio" value="takeout" {...register("orderListVisitType")} />방문 포장
        </label>
      </div>
    </div>

    <div className={s.request}>
      <label>요청사항</label>
        <input type="text" {...register("orderListRequest")}></input>
    </div>

    <div className={s.totalRow}>
      <span className={s.totalLabel}>총 금액</span>
      <span className={s.totalPrice}>{totalPrice.toLocaleString()}원</span>
    </div>

    <button type="submit" className={s.submit}>주문하기</button>
  </form>
  );
}