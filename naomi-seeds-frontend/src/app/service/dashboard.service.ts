import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public server: HttpServerService) { }



// Distributor
  getDistributorSummary(filter: any, dateFrom?: any, dateTo?: any): Observable<any> {
    let url = `${EndPointConst.FOR_DISTRIBUTOR_SUMMARY_DASHBOARD}?`;
    if(dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if(dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    return this.server.get(url, {});
  }




  getDistributorDashboardData(filter: any, dateFrom?: any, dateTo?: any): Observable<any> {
    let url = `${EndPointConst.COMPANY_PERSPECTIVE_DISTRIBUTOR_DASHBOARD_DATA}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.type) {
      url += `&type=${filter.type}`;
    }
    if(dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if(dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    return this.server.get(url, {});
  }

  getDistributorDashboardProductsPurchased(filter: any, dateFrom?: any, dateTo?: any): Observable<any> {
    let url = `${EndPointConst.DISTRIBUTOR_NET_QUANTITY_PURCHASED}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    // if(filter.type) {
    //   url += `&type=${filter.type}`;
    // }
    if(dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if(dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    return this.server.get(url, {});
  }






}
