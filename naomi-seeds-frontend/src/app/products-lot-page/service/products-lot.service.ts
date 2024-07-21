import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsLotService {

  constructor(public server: HttpServerService) { }


  createProductLotData(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_LOT_DATA_BASED_ON_PRODUCT}`, data, {});
  }

  getAllLotData(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_LOT_DATA_ALL}?&page=${filter.page}&count=${filter.count}`;
    if(filter.productId) {
      url += `&productId=${filter.productId}`;
    }
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }

    return this.server.get(url, {});
  }


  getAllLotDataByProductIdDropDownWithValidity(productId: any): Observable<any> {
    const url = `${EndPointConst.LOT_DATA_BY_PRODUCT_ID_DROPDOWN_BY_VALIDITY}/${productId}`;
    return this.server.get(url, {});
  }


  getProductLotDataById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_BY_ID}/${id}`, {});
  }

  getProductLotDataByIdExpanded(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.FIND_LOT_DETAILS_BY_ID_EXPANDED}/${id}`, {});
  }


  updateProductLotById(lotDataId: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_LOT_DATA}/${lotDataId}`, data, {});
  }









}
