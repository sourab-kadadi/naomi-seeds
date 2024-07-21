import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralDropdownsService {

  constructor(public server: HttpServerService) { }


  // addLotData(data: any): Observable<any> {
  //   return  this.server.post(`${EndPointConst.CREATE_LOT_DATA}`, data, {});
  // }

  // updateLotData(lotId: string, data: any): Observable<any> {
  //   return  this.server.put(`${EndPointConst.UPDATE_LOT_DATA}/${lotId}`, data, {});
  // }


  // deleteLotById(lotId: string): Observable<any> {
  //   return  this.server.delete(`${EndPointConst.DELETE_LOT_DATA}/${lotId}`, {});
  // }

  // findLotById(lotId: string): Observable<any> {
  //   return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_BY_ID}/${lotId}`, {});
  // }

  // findLotByActiveQuantityByProduct(productId: string): Observable<any> {
  //   return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_WITH_ACTIVEQUANTITY}/${productId}`, {});
  // }

  findActivePaymentsBusinessCategories(): Observable<any> {
    let url = `${EndPointConst.GENERAL_DROPDOWNS_PAYMENTS_BUSINESS_CATEGORY}`;
    // if(filter.search) {
    //   url += `&filter=${filter.search}`;
    // }
    return this.server.get(url, {});
  }

  findActiveLedgerDistributorCategoryDropDown(): Observable<any> {
    let url = `${EndPointConst.GENERAL_DROPDOWNS_DISTRIBUTOR_LEDGER}`;
    // if(filter.search) {
    //   url += `&filter=${filter.search}`;
    // }
    return this.server.get(url, {});
  }


  getAllStates(): Observable<any> {
    let url = `${EndPointConst.GENERAL_DROPDOWNS_STATES}`;
    return this.server.get(url, {});
  }

  getAllZones(): Observable<any> {
    let url = `${EndPointConst.GENERAL_DROPDOWNS_ZONES}`;
    return this.server.get(url, {});
  }

  getAllDistricts(state?: string): Observable<any> {
    let url = `${EndPointConst.GENERAL_DROPDOWNS_DISTRICTS_BASED_ON_STATE}`;
    if (state) {
      url += `/${state}`;
    }
    return this.server.get(url, {});
  }





}




