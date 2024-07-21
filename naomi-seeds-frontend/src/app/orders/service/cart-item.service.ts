import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { ItemIPT, ItemReturn, ItemSale } from './cart.model';
import { ProfileRole, TypeOfSale } from 'src/app/constants/system.const';

@Injectable({
  providedIn: 'root',
})
export class CartItemService {

  newItem: any;

  private _places = new BehaviorSubject<any>([]);

  constructor() { }

  get places() {
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
  }

  addPlace(
    typeOfSale: any,
    data: any
    // productId: any,
    // productName: string,
    // crop: string,
    // lotId: any,
    // lotNumber: string,
    // packingQty: number,
    // packingUnit: string,
    // effectiveRatePerKgForSale: number,
    // packetInvoicePriceForSale: number,
    // packetMRPPrice: number,
    // numberOfPacketsOrdered: number,
    // itemQuantityInKgs: number,
    // itemAmountForSale: number,

  ) {
    console.log('in add place');


console.log(data)

    if (typeOfSale.includes(TypeOfSale.COMPANY_SALE)) {
      this.newItem = new ItemSale(
        data.productId,
        data.productName,
        data.crop,
        data.lotId,
        data.lotNumber,
        data.packingQty,
        data.packingUnit,
        data.effectiveRatePerKgForSale,
        data.packetInvoicePriceForSale,
        data.packetMRPPrice,
        data.numberOfPacketsOrdered,
        data.itemQuantityInKgs,
        data.itemAmountForSale,
      );
    }
    if (typeOfSale.includes(TypeOfSale.SALES_RETURN)) {
      this.newItem = new ItemReturn(
        data.productId,
        data.productName,
        data.crop,
        data.lotId,
        data.lotNumber,
        data.packingQty,
        data.packingUnit,
        data.effectiveRatePerKgForReturn,
        data.packetInvoicePriceForReturn,
        data.packetMRPPrice,
        data.numberOfPacketsOrdered,
        data.itemQuantityInKgs,
        data.itemAmountForReturn,
      );
    }
    if (typeOfSale.includes(TypeOfSale.IPT)) {
      this.newItem = new ItemIPT(
        data.productId,
        data.productName,
        data.crop,
        data.lotId,
        data.lotNumber,
        data.packingQty,
        data.packingUnit,
        data.packetMRPPrice,
        data.numberOfPacketsOrdered,
        data.itemQuantityInKgs,
        data.effectiveRatePerKgForReturn,
        data.packetInvoicePriceForReturn,
        data.itemAmountForReturn,
        data.effectiveRatePerKgForSale,
        data.packetInvoicePriceForSale,
        data.itemAmountForSale,
      );
    }
    console.log(this.newItem)



    console.log(this.places, 'this.places');

    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        // eslint-disable-next-line no-underscore-dangle
        // console.log(newItem)
        console.log(this._places);
        this._places.next(places.concat(this.newItem));
        console.log(this._places);
        // eslint-disable-next-line no-underscore-dangle
      })
    );
  }

  //   deleteFromCart(i) {
  //     // eslint-disable-next-line no-underscore-dangle
  //     const items = this.places.filter(item => item.id === i.id);
  //     // eslint-disable-next-line no-underscore-dangle
  //     const index = this.places.indexOf(items[0])
  //     if (index > -1) {
  //          // eslint-disable-next-line no-underscore-dangle
  //          this.places.splice(index, 1);
  //     }
  //  }

  // clearCart() {
  // // eslint-disable-next-line no-underscore-dangle
  // this._places.next(Item.pop());
  // // console.log('clearcat');
  // // // eslint-disable-next-line no-underscore-dangle
  // // console.log('this._places', this._places);
  // }

  removeRoomArr() {
    const roomArr: any[] = this._places.getValue();
    console.log(roomArr, 'roomArr')
    roomArr.forEach((item) => {
      roomArr.splice(item);
    });

    this._places.next(roomArr);
  }
}
