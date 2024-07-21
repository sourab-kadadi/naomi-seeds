import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsReceivedService {

  constructor(public server: HttpServerService) { }



  createPaymentReceipt(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.PAYMENT_RECEIVED}`, data, {});
  }





  getPaymentsReceivedAll(filter: any): Observable<any> {
    let url = `${EndPointConst.PAYMENT_RECEIVED_ALL}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.dateFrom) {
      url += `&dateFrom=${filter.dateFrom}`;
    }
    if(filter.dateTo) {
      url += `&dateTo=${filter.dateTo}`;
    }
    if(filter.approvalStatus) {
      url += `&approvalStatus=${filter.approvalStatus}`;
    }
    return this.server.get(url, {});
  }


  getPaymentById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_PAYMENT_RECEIVED_BY_ID}/${id}`, {});
  }



  updatePaymentById(paymentId: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_PAYMENT_RECEIVED_ACCOUNTANT}/${paymentId}`, data, {});
  }


// accountant

rejectPayment(id): Observable<any> {
  return  this.server.get(`${EndPointConst.REJECT_PAYMENT_ACCOUNTANT}/${id}`, {});
}


approveAndupdatePaymentById(paymentId: string, data: any): Observable<any> {
  return  this.server.put(`${EndPointConst.UPDATE_PAYMENT_RECEIVED_ACCOUNTANT}/${paymentId}`, data, {});
}






}
