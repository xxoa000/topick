import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { menuApi } from "../services/menuApi";
import type { MenuResponseDTO } from "../types/menuDTO";
import axios from "axios";
import s from "@/features/menu/components/_menuDetailForm.module.scss";
import type { OrderCreateRequestDTO } from "@/features/order/types/orderDTO";
import { useFormContext } from "react-hook-form";


export default function MenuDetailForm() {
  const { storeNo, menuNo } = useParams();
  const [menu,setMenu] = useState<MenuResponseDTO>();
  const [amount,setAmount] = useState(1);
  const totalPrice = (menu?.menuPrice ?? 0) * amount;
  const { setValue } = useFormContext<OrderCreateRequestDTO>();

  // 메뉴 상세 출력
  useEffect (() => {
    if (!storeNo || !menuNo) return;
    const updateDetail = async() => {
      try {
        const data = await menuApi.selectOne(Number(storeNo),Number(menuNo));
        console.log("data: ",data);
        setMenu(data);
      } catch(error) {
        if (!axios.isAxiosError(error)) return;
        console.log("error: ",error);
      }
    }
    updateDetail();
  },[storeNo, menuNo]);

  // 주문용 상세 데이터 저장
  useEffect (() => {
    if (!storeNo || !menuNo) return;
    setValue("storeNo",Number(storeNo));
    setValue("orderListTotalPrice",Number(totalPrice));
    setValue("detailList", [
      {
        menuNo: Number(menuNo),
        orderDetailAmount: amount,
      }
    ])
  },[storeNo, menuNo, amount, totalPrice, setValue]);


  // 수량 증감
  const handleDecrease = () => setAmount(prev => (prev > 1 ? prev-1 : 1) );
  const handleIncrease = () => setAmount(prev => prev+1);




  return (    
  <div className={s.info} key={menu?.menuNo}>

    <img src="/icon_2.png" alt="default_menu" className={s.image}/>
    <span className={s.menuName}>{menu?.menuName}</span>

    <div className={s.row}>
      <span>가격</span>
      <span className={s.price}>{totalPrice}</span>
    </div>

    <div className={s.row}>
      <span>수량</span>
      <div className={s.amountBox}>
        <button type="button" onClick={handleDecrease}>-</button>
        <span>{amount}</span>
        <button type="button" onClick={handleIncrease}>+</button>
      </div>
    </div>



  </div>
  );
}