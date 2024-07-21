import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';


@Injectable({
  providedIn: 'root'
})
export class DistributorsService {

  constructor(public server: HttpServerService) { }



  getDistributors(): Observable<any> {
    return  this.server.get(`${EndPointConst.DISTRIBUTOR_LIST}`, {});
  }


  


  // updateProductById(productId: string, data: any): Observable<any> {
  //   return  this.server.put(`${EndPointConst.PRODUCT_UPDATE}/${productId}`, data, {});
  // }


}
