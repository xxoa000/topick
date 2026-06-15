import accessApiClient from "@/config/axios";
import type { OrderCreateRequestDTO } from "../types/orderDTO";

export const orderApi = {
  // 새 주문 생성
  create: async( ordCreReqDto : OrderCreateRequestDTO) => {
    const response = await accessApiClient.post(
      "/order/create", ordCreReqDto );
      return response.data;
  } 
}