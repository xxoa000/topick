import { useParams } from "react-router-dom";
import type { MenuResponseDTO } from "../types/menuDTO";
import s from "@/features/menu/components/_menuDetailForm.module.scss";
import type { OrderCreateRequestDTO } from "@/features/order/types/orderDTO";
import { useFormContext, useWatch } from "react-hook-form";

type MenuDetailFormProps = {
  menu: MenuResponseDTO;
};


export default function MenuDetailForm({menu}: MenuDetailFormProps) {
  const { storeNo } = useParams();
  const { setValue, getValues, control } = useFormContext<OrderCreateRequestDTO>();

  // 주문용 상세 데이터 저장
  const detailList = useWatch({
    control,
    name: "detailList",
  }) ?? [];

  // 저장된 값이 없다면 수량 1부터 시작
  const amount = detailList.find(
    (m) => m.menuNo === Number(menu.menuNo)
  )?.orderDetailAmount ?? 0;


  const saveMenu = (nextAmount:number) => {
    //오류 방지
    if (!storeNo || !menu?.menuNo) return;
    
    setValue("storeNo",Number(storeNo));

    // 여러메뉴 주문시 합치기 위한 코드 -> orderForm 에서 총 가격 계산 
    const currentList = getValues("detailList") ?? [];
    const findList = currentList.filter((m)=> m.menuNo !== Number(menu.menuNo));

    // 수량이 0 인 리스트는 제외시킴
    if (nextAmount < 1) {
      setValue("detailList", findList);
      return;
    }

    setValue("detailList", [
      ...findList,
      {
        menuNo: Number(menu?.menuNo),
        orderDetailAmount: nextAmount,
        menuPrice: Number(menu?.menuPrice)
      }
    ]);
  };

  // 수량 증감
  const handleDecrease = () => {
    saveMenu(amount > 0 ? amount-1 : 0);
  };
  const handleIncrease = () => {
    saveMenu(amount+1);
  };



  return (
  <div className={s.info}>

    <div className={s.left}>
      <div className={s.header}>
        <span className={s.name}>{menu.menuName}</span>
      </div>
      <div className={s.amountBox}>
        <span className={s.price}>{menu.menuPrice?.toLocaleString()}원</span>
        <button type="button" onClick={handleDecrease}>-</button>
        <span>{amount}</span>
        <button type="button" onClick={handleIncrease}>+</button>
      </div>
    </div>

    <div className={s.right}>
      <div className={s.menuAction}>
        <span className={s.vatText}>*VAT 포함</span>
        <span className={s.badge}>매장, 원산지 정보</span>
      </div>
      <div className={s.image}>
        <img src={menu.menuImage} alt={menu.menuName} referrerPolicy="no-referrer" />
      </div>
    </div>

  </div>
  );
}