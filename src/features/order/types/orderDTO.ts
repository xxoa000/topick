export type OrderDetailRequestDTO = {
  menuNo : number;
  orderDetailAmount: number;
}


export type OrderCreateRequestDTO = {

  // 주문 1건
	storeNo : number;
	orderListVisitTime : string;
	orderListVisitType : string ;
	orderListRequest : string;
	
	// 주문 1건의 상세
	detailList : OrderDetailRequestDTO[] ;

}