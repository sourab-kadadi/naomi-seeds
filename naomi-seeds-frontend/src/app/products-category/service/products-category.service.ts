import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsCategoryService {

  constructor(public server: HttpServerService) { }


  getProductsCategory(filter: any): Observable<any> {
    let url = `${EndPointConst.PRODUCTS_CATEGORY_LIST}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    return this.server.get(url, {});
  }

  createProductCategory(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.PRODUCT_CATEGORY_ADD}`, data, {});
  }


  getProductCategoryById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_PRODUCT_CATEGORY_BY_ID}/${id}`, {});
  }


  updateProductCategoryById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.PRODUCT_CATEGORY_UPDATE}/${id}`, data, {});
  }

  getProductsCategoryDropDown(): Observable<any> {
    let url = `${EndPointConst.PRODUCT_CATEGORY_DROP_DOWN}`;
    return this.server.get(url, {});
  }

  

}
