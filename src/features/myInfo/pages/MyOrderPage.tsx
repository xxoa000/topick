import { orderApi } from "@/features/order/services/orderApi";
import type { OrderListResponseDTO } from "@/features/order/types/orderDTO";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import s from "@/features/myInfo/pages/_my-order-page.module.scss";

export default function MyOrderPage() {
    const [ order, setOrder ] = useState<OrderListResponseDTO[] | null>([]);
  
    useEffect(() => {
      const fetchOrder = async () => {
        const data = await orderApi.selectList();
        setOrder(data);
      }
      fetchOrder();
    }, []);

    // 에러 방지
    if (!order) return (<div>주문 정보를 불러오는 중입니다...</div>);


	return (
  <section className={s.page}>
    <h3>주문 내역</h3>
    <header className={s.header}>
        <span>식당</span>
        <span>방문 일시</span>
        <span>방문 타입</span>
        <span>가격</span>
        <span> </span>
    </header>
    <section className={s.body}>
      {order.length > 0 ? (
        order.map((list) => (
          <div key={list.orderListNo}>
            <span>{list.orderStoreName}</span>
            <span>{list.orderListVisitTime?.replace("T", " ").slice(2, 16)}</span>
            <span>{list.orderListVisitType}</span>
            <span>{list.orderListFinalPrice?.toLocaleString()}</span>
            <span><NavLink to={`/my-info/order/detail/${list.orderListNo}`}>상세보기</NavLink></span>
          </div>
        ))) : (
        <div className={s.empty}>
          <span>아직 주문 내역이 없습니다.</span>
        </div>
      )}
    </section>
  </section>
  );
}