import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ProductPackingSizeService {

  constructor(public server: HttpServerService) { }


  getPackingSizesByProductId(productId: any): Observable<any> {
    let url = `${EndPointConst.PRODUCT_PACKING_SIZE_LIST}/${productId}`;
    return this.server.get(url, {});
  }

  createProductPackingSize(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.PRODUCT_PACKING_SIZE_ADD}`, data, {});
  }


  getProductPackingSizeById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_PRODUCT_PACKING_SIZE_BY_ID}/${id}`, {});
  }


  updateProductPackingSizeById(productPackingSizeId: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.PRODUCT_PACKING_SIZE_BY_ID_UPDATE}/${productPackingSizeId}`, data, {});
  }


  getPackingSizesByProductIdDropDown(productId: any): Observable<any> {
    let url = `${EndPointConst.PACKING_SIZE_BY_PRODUCT_ID_DROPDOWN}/${productId}`;
    return this.server.get(url, {});
  }




  


}
