import accessApiClient from "@/config/axios";
import type { OrderCreateRequestDTO } from "../types/orderDTO";
import { useForm } from "react-hook-form";
import axios from "axios";
import { orderApi } from "../services/orderApi";

export default function OrderForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  }=useForm<OrderCreateRequestDTO>();

  const handleOrderCreate = async (data:OrderCreateRequestDTO) => {
    try {
      await orderApi.create(data);
      console.log(data);
    } catch(error) {
      if (!axios.isAxiosError(error)) {
				console.error(error);
				return;
			}
    }
  }

  return (
  <form onSubmit={handleSubmit(handleOrderCreate)}>
    <h4>info</h4>
    <label>방문일시
      <input type="date"></input>
      <input type="time"></input>
    </label>
    <label>방문타입</label>
      <input type="button" value="visit"></input>
      <input type="button" value="takeout"></input>
    <label>요청사항</label><input type="text"></input>
    <label>총 금액</label><span>

    </span>

    <button type="submit">주문하기</button>
  </form>
  );
}