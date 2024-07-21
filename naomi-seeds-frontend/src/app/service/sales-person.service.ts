import { Injectable } from '@angular/core';
import { HttpServerService } from './service/http-server.service';

import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';


@Injectable({
  providedIn: 'root'
})
export class SalesPersonService {

  constructor(public server: HttpServerService) { }





  getSalesPersons(): Observable<any> {
    return  this.server.get(`${EndPointConst.SALES_PERSON_LIST}`, {});
  }


}
