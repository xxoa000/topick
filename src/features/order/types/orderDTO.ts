
export type OrderCreateRequestDTO = {

  // 주문 1건
	storeNo : number;
	orderListVisitTime : string;
	orderListVisitType : string ;
	orderListRequest : string;
	orderListTotalPrice?: number;
	
	// 주문 1건의 상세
	detailList : OrderDetailRequestDTO[] ;

}

export type OrderDetailRequestDTO = {
  menuNo : number;
  orderDetailAmount: number;
}