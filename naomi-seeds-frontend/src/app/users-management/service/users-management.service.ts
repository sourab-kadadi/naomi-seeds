import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementService {

  constructor(public server: HttpServerService) { }



  createUser(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.USER_REGISTRATION}`, data, {});
  }

  updateUser(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_USER}/${id}`, data, {});
  }

    getUserDetailsById(_id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_USER_DATA_BY_ID}/${_id}`, {});
  }


  getAllUsers(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_ALL_USERS}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.role) {
      url += `&role=${filter.role}`;
    }
    return  this.server.get(url, {});
  }

  getAllActiveUsersDropDownByRole(userRole: any): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_USERS_BASED_ON_USER_ROLE}/${userRole}`, {});
  }


  // getRoles(): Observable<any> {
  //   return  this.server.get(`${EndPointConst.GET_USER_ROLES}`, {});
  // }





  // getUserWithSeniorityLevel(filter: any): Observable<any> {
  //   let url = `${EndPointConst.GET_USER_LIST}?&page=${filter.page}&count=${filter.count}`;
  //   if(filter.search) {
  //     url += `&filter=${filter.search}`;
  //   }
  //   if(filter.role) {
  //     url += `&role=${filter.role}`;
  //   }
  //   return  this.server.get(url, {});
  // }

  // getUserById(_id): Observable<any> {
  //   return  this.server.get(`${EndPointConst.GET_SINGLE_USER_DATA}/${_id}`, {});
  // }

  // getPermissionsDataByUserProfile(pageLocation?: any): Observable<any> {
  //   let url = `${EndPointConst.GET_PERMISSIONS_DATA}`;
  //   if(pageLocation) {
  //     url += `/${pageLocation}`;
  //   }
  //   return this.server.get(url, {});
  // }

  

}





