import accessApiClient from "@/config/axios";
import type { OrderCreateRequestDTO } from "../types/orderDTO";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function OrderForm() {

  const orderApi = {

    // 새 주문 생성
    create: async( ordCreReqDto : OrderCreateRequestDTO) => {
      const response = await accessApiClient.post(
        "/order/create", ordCreReqDto );
        return response.data;
    } 
  }

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
    <h4>주문하기</h4>
    <label>방문시간
      <input type="date"></input>
      <input type="text"></input>
    </label>
    <label>방문타입</label><input type="text"></input>
    <label>요청사항</label><input type="text"></input>

    <button type="submit">주문하기</button>
  </form>
  );
}