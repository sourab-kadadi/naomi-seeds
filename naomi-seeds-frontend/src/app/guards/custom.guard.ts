import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomGuard implements CanActivate {

  evaluatedValue = false;
  constructor(private ngxPermissionsGuard: NgxPermissionsGuard, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const canReadRouteData = route.data['permissions'].CAN_READ
    const canEditRouteData = route.data['permissions'].CAN_EDIT
    const canCreateRouteData = route.data['permissions'].CAN_CREATE
    const canDeleteRouteData = route.data['permissions'].CAN_DELETE

    const canReadRequestData: any = {
      ...route,
      data: {
        permissions: {
          CAN_WRITE: canReadRouteData
        }
      }
    }

    const canReadGuard = this.ngxPermissionsGuard.canActivate(canReadRequestData, state) as Promise<boolean>

    console.log(canReadGuard)

    // if (canReadGuard) {
    //   console.log(this.evaluatedValue)
    //   this.evaluatedValue = Boolean(canReadGuard);
    //   console.log(this.evaluatedValue)
    //   this.router.navigate(['/not'])
    // } else {
    //   this.router.navigate('/not')
    // }
    

// return canReadGuard.then((data) => {
//   if(!data) {
//     return Promise.reject();
//   }
// })

    return this.evaluatedValue;
    // return this.evaluatedValue;



    // return canReadGuard.then((data: boolean) => {
      // if (!data) {
      //   console.log('here')
      //   // this.router.navigate()
      // } else {

      // }
    // });
    }

  }
