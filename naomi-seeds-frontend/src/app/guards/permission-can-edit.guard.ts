import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { PermissionsDataBehaviourSubjectService } from '../service/permissions-data-behaviour-subject.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionCanEditGuard implements CanActivate {

  permissionsData: any;
  hasPermission: boolean;
  constructor(private ngxPermissionsGuard: NgxPermissionsGuard, private router: Router,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      if (res.permissionsDatapoints[route.data.pageLocation].CAN_EDIT === route.data.permissions.CAN_EDIT === true) {
        this.hasPermission = true;
      } else {
        this.router.navigate(['/app/inventory-details']);
      }
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