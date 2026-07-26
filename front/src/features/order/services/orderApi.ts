import accessApiClient from "@/config/axios";
import type { OrderCreateRequestDTO} from "../types/orderDTO";

export const orderApi = {
  // 새 주문 생성
  create: async( ordCreReqDto : OrderCreateRequestDTO) => {
    const response = await accessApiClient.post(
      "/order/create", ordCreReqDto );
      return response.data;
  },

  // 주문 리스트 조회
  selectList: async() => {
    const response = await accessApiClient.get(
      "/order/list");
    return response.data;
  },

  //주문 상세 조회
  selectOne: async( orderListNo : number ) => {
    const response = await accessApiClient.get(
      `order/detail/${orderListNo}`
    );
    return response.data;
  },
}