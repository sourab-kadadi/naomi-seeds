import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(public server: HttpServerService) { }


  getProducts(filter: any): Observable<any> {
    let url = `${EndPointConst.PRODUCTS_LIST}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    return this.server.get(url, {});
  }

  createProduct(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.PRODUCT_ADD}`, data, {});
  }


  getProductById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_PRODUCT_BY_ID}/${id}`, {});
  }


  updateProductById(productId: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.PRODUCT_UPDATE}/${productId}`, data, {});
  }




}
