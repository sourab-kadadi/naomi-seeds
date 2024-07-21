import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {

  constructor(public server: HttpServerService) { }



  getLedgerEntries(filter: any, dateFrom?: any, dateTo?: any): Observable<any> {
    let url = `${EndPointConst.LEDGER_GET}?`;
    if(filter.statementProfileIdRequired) {
      url += `&statementProfileIdRequired=${filter.statementProfileIdRequired}`;
    }
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(dateFrom) {
      url += `&dateFrom=${dateFrom}`;
    }
    if(dateTo) {
      url += `&dateTo=${dateTo}`;
    }
    return this.server.get(url, {});
  }







  // getLedgerSummaryDistributor(filterLedger?: any, dateFrom?: any, dateTo?: any): Observable<any> {
  //   let url = `${EndPointConst.DISTRIBUTOR_ACCOUNT_STATEMENT}?`;
  //   if(filterLedger.search) {
  //     url += `&filter=${filterLedger.search}`;
  //   }
  //   if(filterLedger.particularType) {
  //     url += `&particularType=${filterLedger.particularType}`;
  //   }
  //   if(dateFrom) {
  //     url += `&dateFrom=${dateFrom}`;
  //   }
  //   if(dateTo) {
  //     url += `&dateTo=${dateTo}`;
  //   }
  //   return this.server.get(url, {});
  // }







// Summary for Distributor
// getDistributorSummary(dateFrom?: any, dateTo?: any): Observable<any> {
//   let url = `${EndPointConst.FOR_DISTRIBUTOR_SUMMARY_DASHBOARD}?`;
//   if(dateFrom) {
//     url += `&dateFrom=${dateFrom}`;
//   }
//   if(dateTo) {
//     url += `&dateTo=${dateTo}`;
//   }
//   return this.server.get(url, {});
// }











}
