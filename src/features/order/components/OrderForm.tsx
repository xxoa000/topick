import type { OrderCreateRequestDTO } from "../types/orderDTO";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { orderApi } from "../services/orderApi";
import s from "@/features/order/components/_order-form.module.scss";
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

  
  // 미국 시간을 한국 시간으로 변환 (미국-한국 시차는 -540분이므로 60000(초)을 곱한다)
  const toDateTimeLocal = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    // YYYY-MM-DDTHH:mm 년-월-일-시간-분 까지만 추출
    return new Date(date.getTime() - offset).toISOString().slice(0,16);
  }

  // 예약시간보다 이전 날짜, 시간은 예약 불가하는 코드
  const now = new Date();
  const minDateTime = toDateTimeLocal(now);

  // 오늘 시간만 예약 가능하도록 설정하는 코드
  const endDay = new Date(now);
  // 마지막 예약 가능 시간은 21시로 하드코딩 (추후 개선)
  endDay.setHours(21,0,0,0);
  const maxDateTime = toDateTimeLocal(endDay);


  // 총 금액 계산
  const detailList = watch("detailList") ?? [];
  const totalPrice = detailList.reduce( (sum,m) => {
    return sum + m.menuPrice * m.orderDetailAmount;
  },0);


  const handleOrderCreate = async (data:OrderCreateRequestDTO) => {
    if (!isLogin) {
      alert("먼저 로그인을 해주세요.");
      navigate("/member/login");
      return;
    }
    if (totalPrice<10000) return;   //최소 금액 설정

    try {
      const orderListNo = await orderApi.create(data);
      
      alert("주문완료, 결제창으로 넘어갑니다.");
      navigate(`/payment/${orderListNo}`);

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
        <input type="datetime-local" min={minDateTime} max={maxDateTime} step="300" {...register("orderListVisitTime")}></input>
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

    {totalPrice < 10000 && <span className={s.message}>⚠︎ 최소 주문금액은 10,000원 입니다.</span>}
    <button type="submit" className={s.submit} disabled={totalPrice<10000}>주문하기</button>
  </form>
  );
}