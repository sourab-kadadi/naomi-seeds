export class ItemSale {
  constructor(
public productId: any,
public productName: string,
public crop: string,
public lotId: any,
public lotNumber: string,
public packingQty: number,
public packingUnit: string,
public effectiveRatePerKgForSale: number,
public packetInvoicePriceForSale: number,
public packetMRPPrice: number,
public numberOfPacketsOrdered: number,
public itemQuantityInKgs: number,
public itemAmountForSale: number,
 ) {}
}

export class ItemReturn {
  constructor(
public productId: any,
public productName: string,
public crop: string,
public lotId: any,
public lotNumber: string,
public packingQty: number,
public packingUnit: string,
public effectiveRatePerKgForReturn: number,
public packetInvoicePriceForReturn: number,
public packetMRPPrice: number,
public numberOfPacketsOrdered: number,
public itemQuantityInKgs: number,
public itemAmountForReturn: number,
 ) {}
}


export class ItemIPT {
  constructor(
public productId: any,
public productName: string,
public crop: string,
public lotId: any,
public lotNumber: string,
public packingQty: number,
public packingUnit: string,
public packetMRPPrice: number,
public numberOfPacketsOrdered: number,
public itemQuantityInKgs: number,
public effectiveRatePerKgForReturn: number,
public packetInvoicePriceForReturn: number,
public itemAmountForReturn: number,
public effectiveRatePerKgForSale: number,
public packetInvoicePriceForSale: number,
public itemAmountForSale: number,
) {}
}