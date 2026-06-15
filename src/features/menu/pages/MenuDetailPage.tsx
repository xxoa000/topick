import OrderForm from "@/features/order/components/OrderForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { menuApi } from "../services/menuApi";
import type { MenuResponseDTO } from "../types/menuDTO";
import axios from "axios";

export default function MenuDetailPage() {
  const { storeNo, menuNo } = useParams();
  const [menu,setMenu] = useState<MenuResponseDTO>();

  //메뉴 상세 출력
  useEffect (() => {
    if (!storeNo || !menuNo) return;
    const updateDetail = async() => {
      try {
        const data = await menuApi.selectOne(Number(storeNo),Number(menuNo));
        console.log(data);
        setMenu(data);
      } catch(error) {
        if (!axios.isAxiosError(error)) return;
        console.log(error);
      }
    }
    updateDetail();
  },[storeNo, menuNo]);



  return (
  <form>
    메뉴 상세
    <div key={menu?.menuNo}>
      <span><b>{menu?.menuName}</b></span>
      <label>가격</label> <span>{menu?.menuPrice}</span>
      <label>수량</label>
      {/* <span>{orderDetail.orderDetailAmount}</span> */}
    </div>
    <OrderForm />
  </form>
  );
}