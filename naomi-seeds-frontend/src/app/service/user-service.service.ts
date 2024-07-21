import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../service/service/http-server.service';
import { EndPointConst } from '../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(public server: HttpServerService) { }



  createUserProfile(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.USER_REGISTRATION}`, data, {});
  }

  getRoles(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_USER_ROLES}`, {});
  }



  getAllUser(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_USER_LIST}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.role) {
      url += `&role=${filter.role}`;
    }
    return  this.server.get(url, {});
  }

  getUserWithSeniorityLevel(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_USER_LIST}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.role) {
      url += `&role=${filter.role}`;
    }
    return  this.server.get(url, {});
  }

  getUserById(_id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_USER_DATA_BY_ID}/${_id}`, {});
  }

  getPermissionsDataByUserProfile(pageLocation?: any): Observable<any> {
    let url = `${EndPointConst.GET_PERMISSIONS_DATA}`;
    if(pageLocation) {
      url += `/${pageLocation}`;
    }
    return this.server.get(url, {});
  }

  

}





