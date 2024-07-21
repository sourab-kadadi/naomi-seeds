import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service'

@Injectable({
  providedIn: 'root'
})
export class ProfileManagementService {

  constructor(public server: HttpServerService) { }



  createProfile(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_PROFILE}`, data, {});
  }

  updateProfileById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_PROFILE}/${id}`, data, {});
  }


  getProfileDetailsById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_PROFILE_BY_ID}/${id}`, {});
  }

  getAllProfiles(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_ALL_PROFILES}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.role) {
      url += `&role=${filter.role}`;
    }
    return  this.server.get(url, {});
  }

  getAllProfilesBasedOnProfileRole(profileRole: any): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_PROFILES_BASED_ON_PROFILE_ROLE}/${profileRole}`, {});
  }

  getAllDistributorProfiles(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_DISTRIBUTOR_PROFILES}`, {});
  }

  getAllDistributorBasedOnAllotmentOfUser(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_DISTRIBUTOR_BY_USER_ALLOTMENT}`, {});
  }

  // getAllProfilesBasedOnProfileRoleWithPermissions(profileRole: any): Observable<any> {
  //   return  this.server.get(`${EndPointConst.GET_ALL_PROFILES_BASED_ON_PROFILE_ROLE}/${profileRole}`, {});
  // }




}
