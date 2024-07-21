import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class LotDataService {

  constructor(public server: HttpServerService) { }


  addLotData(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_LOT_DATA}`, data, {});
  }

  updateLotData(lotId: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_LOT_DATA}/${lotId}`, data, {});
  }


  deleteLotById(lotId: string): Observable<any> {
    return  this.server.delete(`${EndPointConst.DELETE_LOT_DATA}/${lotId}`, {});
  }

  findLotById(lotId: string): Observable<any> {
    return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_BY_ID}/${lotId}`, {});
  }

  findLotByActiveQuantityByProduct(productId: string): Observable<any> {
    return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_WITH_ACTIVEQUANTITY}/${productId}`, {});
  }

  findLotDataAllByProduct(filter: any, productId: string): Observable<any> {
    let url = `${EndPointConst.FIND_LOT_DETAILS_ALL}?&page=${filter.page}&count=${filter.count}`;
    if(productId) {
      url += `&productId=${productId}`;
    }
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.availability) {
      url += `&availability=${filter.availability}`;
    }
    return this.server.get(url, {});
  }


}
