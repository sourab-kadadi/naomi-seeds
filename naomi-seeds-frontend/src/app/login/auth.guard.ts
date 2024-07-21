

import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../service/service/storage.service';
import { AuthService } from './auth.service';
// import { Strings } from '../constants/system.const';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  role: any;
  isLoggedIn: any;
  constructor(private authService: AuthService,
    public ionStorage: StorageService,
    private router: Router, route: ActivatedRoute,
    public auth: AuthService) {
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return this.canActivate(next, state);
  // }
  // canDeactivate(
  //   component: unknown,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }


  async checkUserLogin(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    // if (this.authService.isLoggedIn()) {
      // const userRole = this.authService.getRole();
      const tokenData = await this.auth.jwtDecoder();

      if (tokenData) {
        console.log(tokenData)
        const role = tokenData.roles[0];
        if (route.data.role && route.data.role.indexOf(role) === -1) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }

    // }
    // this.router.navigate(['/home']);
    // return false;
  }

}



// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     // private alertCtrl: AlertController,
//     private authService: AuthService,
//     private router: Router) {}




//     canActivate(
//       route: ActivatedRouteSnapshot,
//       state: RouterStateSnapshot
//     ): UrlTree {
//       const user = this.authService.jwtDecoder();;
//       return (
//         (user?.roles === 'ADMIN' && this.router.parseUrl('/admin')) ||
//         (user?.roles === 'SALES_OFFICER' && this.router.parseUrl('/sales-officer')) ||
//         this.router.parseUrl('/auth')
//       );
//     }

//     // canActivate(
//     //   next: ActivatedRouteSnapshot,
//     //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

//     //     if (!this.authService.isLoggedIn()) {
//     //       this.router.navigate(['/login']); // go to login if not authenticated
//     //       return false;
//     //     }
//     //   return true;
//     // }


//   // canLoad(
//   //   route: Route,
//   //   segments: UrlSegment[]
//   //   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//   //   return true;
//   // }

// //   canActivate(): boolean {
// //     const token = this.authService.jwtDecoder();
// //     console.log(token);
// //   if (!token || token == '' || token.userType != 'MANAGER') {
// //     this.router.navigate(['/manager']);
// //     return false;
// //   }
// //   return true;
// // }
// // navigate(url) {
// //   this.router.navigateByUrl(url, {replaceUrl: true});
// //   return false;
// // }

//   // canLoad(
//   //   route: Route,
//   //   segments: UrlSegment[]): Promise<boolean> {
//   //     const roleType = route.data.roles;
//   //     // try {
//   //       // const type = await this.authService.checkUserAuth();
//   //       // if(type) {
//   //         // if(type == roleType) {return true;}
//   //         // else {
//   //           let url = Strings.ADMIN; //'/tabs'
//   //           if(roleType == 'ADMIN') {url = Strings.ADMIN;} //'/admin'
//   //           this.navigate(url);
//   //           // if(roleType == 'MANAGER') {url = Strings.MANAGER;} //'/admin'
//   //           // this.navigate(url);

//   //           // if(roleType == 'SALES_OFFICER') {url = Strings.SALES_OFFICER;} //'/admin'
//   //           // this.navigate(url);
//   //         // }
//   //       // } else {
//   //         // this.checkForAlert(roleType);
//   //       // }
//   //     // } catch(e) {
//   //       // console.log(e);
//   //       // this.checkForAlert(roleType);
//   //     // }
//   // }




// }
