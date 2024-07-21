//not in use


import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { Item } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartItemService {
  private _places = new BehaviorSubject<Item[]>([]);

  constructor() {}

  get places() {
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
  }

  addPlace(
    productId: any,
    productName: string,
    lotId: any,
    lotNumber: string,
    packingQty: number,
    packingUnit: string,
    effectiveRatePerKg: number,
    packetInvoicePrice: number,
    packetMRPPrice: number,
    numberOfPacketsOrdered: number,
    itemQuantityInKgs: number,
    itemAmount: number,
  ) {
    console.log('in add place');

    const newItem = new Item(
      productId,
      productName,
      lotId,
      lotNumber,
      packingQty,
      packingUnit,
      effectiveRatePerKg,
      packetInvoicePrice,
      packetMRPPrice,
      numberOfPacketsOrdered,
      itemQuantityInKgs,
      itemAmount,
    );

    console.log(this.places, 'this.places');

    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        // eslint-disable-next-line no-underscore-dangle
        console.log(newItem)
        console.log(this._places);
        this._places.next(places.concat(newItem));
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
