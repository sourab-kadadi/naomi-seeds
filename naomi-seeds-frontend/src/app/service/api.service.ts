import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from '../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public server: HttpServerService) { }


  // productsList(filter: any): Observable<any> {
  //   let url = `${EndPointConst.PRODUCTS_LIST}?&page=${filter.page}&count=${filter.count}&searchBy=${filter.searchBy}`;
  //   if(filter.search) {
  //     url += `&search=${filter.search}`;
  //   }
  //   // if(filter.location) {
  //   //   url += `&location=${filter.location}`
  //   // }
  //   return  this.server.get(url, {});
  // }

  // getCompanyDetails(_id: any): Observable<any> {
  //   let url = `${EndPointConst.COMPANY_DETAILS}/${_id}`;
  //   return  this.server.get(url, {});
  // }

}
