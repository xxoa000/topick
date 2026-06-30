import { orderApi } from "@/features/order/services/orderApi";
import type { OrderListResponseDTO } from "@/features/order/types/orderDTO";
import { useEffect, useState } from "react";
import s from "@/features/myInfo/pages/_my-order-detail-page.module.scss";
import { useParams } from "react-router-dom";

export default function MyOrderDetailPage() {
  const [ order, setOrder ] = useState<OrderListResponseDTO | null>(null);
  const { orderListNo }  = useParams();
  
  useEffect(() => {
    const fetchOrder = async () => {
      const data = await orderApi.selectOne(Number(orderListNo));
      console.log("주문리스트:", data);
      setOrder(data);
    }
    fetchOrder();
  }, [orderListNo]);

  const totalPrice = order?.detailList?.reduce((sum, o) => {
    return sum + o.orderDetailTodayPrice * o.orderDetailAmount;
  }, 0) ?? 0;

    // 에러 방지
    if (!order) return (<div>주문 상세 정보를 불러오는 중입니다...</div>);


	return (
  <section className={s.page}>
    <h3>주문 상세</h3>
    <article className={s.box}>
      <div className={s.row}>
        <label>{order?.orderStoreName}</label>
      </div>
      <div className={s.row}>
        <span>{order?.orderListCreateAt?.replaceAll("-",".").replace("T"," ").slice(0,16)}</span>
        <span>no.{order?.orderListNo}</span>
      </div>
    </article>
    
    <header className={s.header}>
        <span>메뉴</span>
        <span>수량</span>
        <span>가격</span>
    </header>

    <section className={s.body}>
      {order?.detailList?.map((det) => (
        <div key={det.orderDetailNo} className={s.orderItem}>
          <span className={s.menuName}>{det.orderDetailMenuName}</span>
          <span className={s.amount}>{det.orderDetailAmount}</span>
          <span className={s.price}>{det.orderDetailTodayPrice.toLocaleString()}원</span>
        </div>
      ))}
      </section>

      <footer className={s.box}>
        <div className={s.row}>
          <label>방문 일시</label>
          <span>
            {order?.orderListVisitTime?.replaceAll("-",".").replace("T"," ").slice(2,16)}&nbsp;&nbsp;
            {order?.orderListVisitType}
          </span>
        </div>
        <div className={s.row}>
          <label>요청사항</label>
          <span>{order?.orderListRequest}</span>
        </div>
        <div className={s.row}>
          <label>총 금액</label>
          <span className={s.totalPrice}>{totalPrice.toLocaleString()}원</span>
        </div>
      </footer>
      
  </section>
  );
}