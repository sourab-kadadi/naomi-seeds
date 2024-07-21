import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service'

@Injectable({
  providedIn: 'root'
})
export class RoleAndPermissionService {

  constructor(public server: HttpServerService) { }

  getAllActiveRoleGroupsDropDown(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_ACTIVE_ROLE_GROUPS_DROPDOWN}`, {});
  }


  // getAllRoles(): Observable<any> {
  //   let url = `${EndPointConst.GET_ALL_ROLES}`;
  //   return this.server.get(url, {});
  // }

  getRolePermissionsDetailsById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ROLE_AND_PERMISSION_BY_ID}/${id}`, {});
  }

  createRoleAndPermissions(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_ROLE_AND_PERMISSIONS}`, data, {});
  }

  updateRoleAndPermissionsById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_PERMISSIONS}/${id}`, data, {});
  }

  getRoleBySeniorityLevel(level: number): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ROLE_BY_SENIORITY_LEVEL}/${level}`, {});
  }

  getRoleGroupsDropDownByUserType(userType: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_BY_USER_TYPE_ACTIVE_ROLE_GROUPS_DROPDOWN}/${userType}`, {});
  }

  getRoleGroupsDropDownByUserTypeWithPermissions(userType: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_BY_USER_TYPE_ACTIVE_ROLE_GROUPS_DROPDOWN_WITH_PERMISSIONS}/${userType}`, {});
  }



}
