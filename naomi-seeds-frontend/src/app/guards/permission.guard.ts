import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { PermissionsDataBehaviourSubjectService } from '../service/permissions-data-behaviour-subject.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

permissionsData: any;
hasPermission: boolean;
  constructor(private ngxPermissionsGuard: NgxPermissionsGuard, private router: Router,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService
    ) {

    
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


//       const canReadRouteData = route.data['permissions'].CAN_READ
//       const canEditRouteData = route.data['permissions'].CAN_EDIT
//       const canCreateRouteData = route.data['permissions'].CAN_CREATE
//       const canDeleteRouteData = route.data['permissions'].CAN_DELETE

// console.log(canReadRouteData)
// // console.log(this.)

// console.log(route.data)



this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
  console.log(res);
console.log(res.permissionsDatapoints[route.data.pageLocation])

if (res.permissionsDatapoints[route.data.pageLocation].CAN_READ === route.data.permissions.CAN_READ === true) {
  this.hasPermission = true;

} else {
  this.router.navigate(['/app/inventory-details']);  
}
// this.hasPermission = true
      if (!this.hasPermission) {
        // Redirect the user to a page indicating that they do not have permission
        this.router.navigate(['/app/inventory-details']);
        return false;
      }

}
 ) 





    return this.hasPermission;
  }
}