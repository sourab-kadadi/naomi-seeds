import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(public server: HttpServerService) { }


  addRequirement(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.REQUIREMENT_CREATE}`, data, {});
  }

  // updateLotData(lotId: string, data: any): Observable<any> {
  //   return  this.server.put(`${EndPointConst.UPDATE_LOT_DATA}/${lotId}`, data, {});
  // }


  // deleteLotById(lotId: string): Observable<any> {
  //   return  this.server.delete(`${EndPointConst.DELETE_LOT_DATA}/${lotId}`, {});
  // }


  // findLotById(lotId: string): Observable<any> {
  //   return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_BY_ID}/${lotId}`, {});
  // }

  // findAll(productId: string): Observable<any> {
  //   return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_WITH_ACTIVEQUANTITY}/${productId}`, {});
  // }

  findAll(filter: any, dateFrom?: any, dateTo?: any): Observable<any> {
    let url = `${EndPointConst.REQUIREMENT_GET_ALL}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.dispatchedStatus) {
      url += `&dispatchedStatus=${filter.dispatchedStatus}`;
    }
    if(dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if(dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    return this.server.get(url, {});
  }


  findAllOverView(filter: any, dateFrom?: any, dateTo?: any): Observable<any> {
    let url = `${EndPointConst.REQUIREMENT_DASHBOARD}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if(dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    // if(filter.dispatchedStatus) {
    //   url += `&dispatchedStatus=${filter.dispatchedStatus}`;
    // }
    return this.server.get(url, {});
  }



}
