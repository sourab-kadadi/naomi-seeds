////file not in use////////



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(public server: HttpServerService) { }

////sales by plant manager/////
createSalesByPlantManager(data: any): Observable<any> {
  return  this.server.post(`${EndPointConst.CREATE_SALES}`, data, {});
}

getSalesByPM(filter: any): Observable<any> {
  let url = `${EndPointConst.SALES_ALL_PM}?&page=${filter.page}&count=${filter.count}`;
  if(filter.search) {
    url += `&filter=${filter.search}`;
  }
  // if(filter.fromDistributorApproval) {
  //   url += `&fromDistributorApproval=${filter.fromDistributorApproval}`;
  // }
  if(filter.managerApprovalGenerateDC) {
    url += `&managerApprovalGenerateDC=${filter.managerApprovalGenerateDC}`;
  }
  if(filter.salesOfficerApprovalStatus) {
    url += `&salesOfficerApprovalStatus=${filter.salesOfficerApprovalStatus}`;
  }
  if(filter.toDistributorConfirmation) {
    url += `&toDistributorConfirmation=${filter.toDistributorConfirmation}`;
  }
  if(filter.managerFinalApproval) {
    url += `&managerFinalApproval=${filter.managerFinalApproval}`;
  }
  return this.server.get(url, {});
}










////////////////////////IPT/////////////////////////

createIpt(data: any): Observable<any> {
  return  this.server.post(`${EndPointConst.CREATE_IPT}`, data, {});
}





getIptBySalesPerson(filter: any): Observable<any> {
  let url = `${EndPointConst.GET_IPT_BY_SALES_PERSON}?&page=${filter.page}&count=${filter.count}`;
  if(filter.search) {
    url += `&filter=${filter.search}`;
  }
  if(filter.fromDistributorApproval) {
    url += `&fromDistributorApproval=${filter.fromDistributorApproval}`;
  }
  if(filter.managerApprovalGenerateDC) {
    url += `&managerApprovalGenerateDC=${filter.managerApprovalGenerateDC}`;
  }
  if(filter.salesOfficerApprovalStatus) {
    url += `&salesOfficerApprovalStatus=${filter.salesOfficerApprovalStatus}`;
  }
  if(filter.toDistributorConfirmation) {
    url += `&toDistributorConfirmation=${filter.toDistributorConfirmation}`;
  }
  if(filter.managerFinalApproval) {
    url += `&managerFinalApproval=${filter.managerFinalApproval}`;
  }
  return this.server.get(url, {});
}




getIptAll(filter: any): Observable<any> {
  let url = `${EndPointConst.IPT_ALL}?&page=${filter.page}&count=${filter.count}`;
  if(filter.search) {
    url += `&filter=${filter.search}`;
  }
  if(filter.fromDistributorApproval) {
    url += `&fromDistributorApproval=${filter.fromDistributorApproval}`;
  }
  if(filter.managerApprovalGenerateDC) {
    url += `&managerApprovalGenerateDC=${filter.managerApprovalGenerateDC}`;
  }
  if(filter.salesOfficerApprovalStatus) {
    url += `&salesOfficerApprovalStatus=${filter.salesOfficerApprovalStatus}`;
  }
  if(filter.toDistributorConfirmation) {
    url += `&toDistributorConfirmation=${filter.toDistributorConfirmation}`;
  }
  if(filter.managerFinalApproval) {
    url += `&managerFinalApproval=${filter.managerFinalApproval}`;
  }
  if(filter.pendingApprovalsManager) {
    url += `&pendingApprovalsManager=${filter.pendingApprovalsManager}`;
  }
  return this.server.get(url, {});
}





getSalesOrderById(_id): Observable<any> {
  return  this.server.get(`${EndPointConst.GET_IPT_BY_ID}/${_id}`, {});
}

getSalesOrderByIdAndUserFilter(_id): Observable<any> {
  return  this.server.get(`${EndPointConst.FILTER_FIND_SALES_ORDER_BY_USER}/${_id}`, {});
}






getIptByDistributor(filter: any): Observable<any> {
  let url = `${EndPointConst.GET_IPT_BY_DISTRIBUTOR}?&page=${filter.page}&count=${filter.count}`;
  if(filter.search) {
    url += `&filter=${filter.search}`;
  }
  if(filter.fromDistributorApproval) {
    url += `&fromDistributorApproval=${filter.fromDistributorApproval}`;
  }
  if(filter.managerApprovalGenerateDC) {
    url += `&managerApprovalGenerateDC=${filter.managerApprovalGenerateDC}`;
  }
  if(filter.salesOfficerApprovalStatus) {
    url += `&salesOfficerApprovalStatus=${filter.salesOfficerApprovalStatus}`;
  }
  if(filter.toDistributorConfirmation) {
    url += `&toDistributorConfirmation=${filter.toDistributorConfirmation}`;
  }
  if(filter.managerFinalApproval) {
    url += `&managerFinalApproval=${filter.managerFinalApproval}`;
  }
  if(filter.pendingApproval) {
    url += `&pendingApproval=${filter.pendingApproval}`;
  }
  return this.server.get(url, {});
}



////////////////////////Approvals/////////////////

// stage 1
approveByFromDistributor(id): Observable<any> {
  return  this.server.get(`${EndPointConst.FROM_DISTRIBUTOR_APPROVAL_STAGE1}/${id}`, {});
}

// stage 2
approveByManagerDC(id): Observable<any> {
  return  this.server.get(`${EndPointConst.MANAGER_APPROVAL_DC_STAGE2}/${id}`, {});
}

// stage 3
onApproveBySalesOfficerShipping(id): Observable<any> {
  return  this.server.get(`${EndPointConst.SALES_OFFICER_APPROVAL_STAGE3}/${id}`, {});
}

// stage 4
approveByToDistributor(id): Observable<any> {
  return  this.server.get(`${EndPointConst.TO_DISTRIBUTOR_APPROVAL_STAGE4}/${id}`, {});
}

// stage 5
approveByManagerFinalSales(id): Observable<any> {
  return  this.server.get(`${EndPointConst.MANAGER_FINAL_APPROVAL_STAGE5_SALESORDER}/${id}`, {});
}

approveByManagerFinalIPT(id): Observable<any> {
  return  this.server.get(`${EndPointConst.MANAGER_FINAL_APPROVAL_STAGE5_IPT}/${id}`, {});
}



































  createDeliveryChallan(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_DELIVERY_CHALLAN}`, data, {});
  }


  getDeliveryChallanAll(filter: any): Observable<any> {
    let url = `${EndPointConst.DELIVERY_CHALLAN_ALL}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    return this.server.get(url, {});
  }




  getChallanById(_id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CHALLAN_BY_ID}/${_id}`, {});
  }




getChallanBySalesPerson(id): Observable<any> {
  return  this.server.get(`${EndPointConst.GET_CHALLAN_BY_SALES_PERSON}/${id}`, {});
}


approveDeliveryChallan(id): Observable<any> {
  return  this.server.get(`${EndPointConst.CHALLAN_APPROVAL}/${id}`, {});
}




//////Invoice///////

createInvoice(data: any): Observable<any> {
  return  this.server.post(`${EndPointConst.CREATE_INVOICE}`, data, {});
}






getInvoiceBySalesPerson(id): Observable<any> {
  return  this.server.get(`${EndPointConst.GET_INVOICE_BY_SALES_PERSON}/?&page=0&count=10&approvalStatus=APPROVED`, {});
}


getInvoiceAll(filter: any): Observable<any> {
  let url = `${EndPointConst.INVOICE_ALL}?&page=${filter.page}&count=${filter.count}`;
  if(filter.search) {
    url += `&search=${filter.search}`;
  }
  if(filter.location) {
    url += `&location=${filter.location}`;
  }
  return this.server.get(url, {});
}







}
