export type PaymentFormDTO = {
  point: number
}

export type PaymentRequestDTO = {
  orderListNo : number,
	paymentMethod? : string,
  paymentPrice : number,
	paymentTid? : string,
}