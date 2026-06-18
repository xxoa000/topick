import accessApiClient from "@/config/axios";
import type { PaymentRequestDTO } from "../types/paymentDTO";

const paymentApi = {
  ready: async(payReqDto : PaymentRequestDTO) => {
    const response = await accessApiClient.post("/payment/ready", payReqDto);
    return response.data;
  }

}

export default paymentApi;