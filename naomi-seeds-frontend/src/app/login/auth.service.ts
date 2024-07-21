



import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../app/service/service/http-server.service';
import { EndPointConst } from '../constants/end-point.const';


import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ConstantPool } from '@angular/compiler';
import { StorageService } from '../service/service/storage.service';
import { UserServiceService } from '../service/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenData: any;
  roleAs: string;
  public isLoggedIn: boolean = false;
  loggedInState: any;
  isLogin: boolean = false;

  public permissionsData: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    public ionStorage: StorageService,
    public server: HttpServerService,
    private userService: UserServiceService


  ) { }
   login(data: any): Observable<any> {
    return this.server.post(`${EndPointConst.LOGIN}`, data, {});
  }


  // async isUserLoggedIn() {
  //   let getSession: any = await this.ionStorage.get("token");
  //   console.log(getSession)
  //   const sessionData = getSession.then(res => 
  //     {          console.log(res, 'res');               
  //             })
  //   if (getSession) {
  //     this.isLoggedIn = true;
  //     return getSession;
  //   }
  //   this.isLoggedIn = false;
  //   return '';
  // }

  async jwtDecoder() {
    const helper = new JwtHelperService();
    let token = await this.getAccessToken();
    console.log(token);
    if(token != '') {
    return helper.decodeToken(token);
    } else {
      return '';
    }
  }

  async getTokenData() {
    const helper = new JwtHelperService();
    const token = this.ionStorage.get('token').then(res => helper.decodeToken(res));
    console.log('token', token)
    const user = token.then(result => {
      // console.log(result)
      // return result})
      // return user
      if (result) {
        this.tokenData = result;
       console.log(result)
        // this.getUserById();
      } else {
        console.log('here')
        return;
      }
    });
  }

  async getAccessToken() {
    let getSession: any = await this.ionStorage.get("token");
    console.log(getSession)
    console.log('access');
    if (getSession) {
      this.isLoggedIn = true;
      return getSession;
    }
    console.log('1');
    this.isLoggedIn = false;
    return '';
  }

  refreshToken(refreshToken: string): any {
    if (refreshToken) {
      return this.http.post(`${EndPointConst.REFRESH_TOKEN}`, { refreshToken: refreshToken });
    } else {
      this.moveUserOut();
      return null;
    }
  }


  async logout() {
    const token = JSON.parse(localStorage.getItem('refreshToken') || '{}');
    const refreshToken = token;
    if (refreshToken) {
      this.http.post(`${EndPointConst.LOGOUT}`, { refreshToken: refreshToken })
    }
    await this.ionStorage.clear("token");
    await this.ionStorage.clear("refreshToken");
  }


  moveUserOut() {
    this.isLoggedIn = false;
    localStorage.clear();
    this.router.navigate(['/']);
  }




 

  async getAndStoreUserPermissions() {
    this.userService.getPermissionsDataByUserProfile().subscribe(res => {
  if (res && res.data && res.data.permissionsData) {
    this.permissionsData = res.data.permissionsData;
    console.log(this.permissionsData)
    
    // return this.permissionsData;
    // const serializedPermissionsData = JSON.stringify(res.data.permissionsData)
    // console.log(serializedPermissionsData)
    // this.ionStorage.set("serializedPermissionsData", serializedPermissionsData);
  }},
  error => {
    // this.ngxUiLoader.stopLoader('loader-login');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    // this.ngxUiLoader.stopLoader('loader-login');
    if (error.statusCode && error.statusCode === 401) {
      // this.presentAlert('Unauthorized, please enter valid email and password');
    } else {
      // this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    }
  });
  }










}









  // isLoggedIn = false;

  // constructor(public server: HttpServerService,
  //   private http: HttpClient,
	// 	private router: Router
  //   ) { }

  // login(data: any): Observable<any> {
  //   return  this.server.post(`${EndPointConst.LOGIN}`, data, {});
  // }




  // getAccessToken() {
  //   let getSession = JSON.parse(localStorage.getItem('token') ||  '{}');
  //   if (getSession) {
  //     this.isLoggedIn = true;
  //     return getSession.access_token;
  //   }
  //   this.isLoggedIn = false;
  //   return '';
  // }


  // refreshToken(): any {
	// 	const token = JSON.parse(localStorage.getItem('token') ||  '{}');
	// 	const refreshTokne = token.refresh_token;
  //   console.log('inside', refreshTokne);
  //   if (refreshTokne) {
  //     return this.http.post(`${EndPointConst.REFRESH_TOKEN}`, {refreshToken: refreshTokne}).pipe(
  //       map(res => {
  //         return res;
  //       }, (err: any) => {
  //          this.moveUserOut();
  //          return null;
  //       })
  //     )
  //   } else {
  //      this.moveUserOut();
  //      return null;
  //   }
  // }


  // logout() {
	// 	const token = JSON.parse(localStorage.getItem('token') || '{}');
	// 	const refreshToken = token.refresh_token;
  //   if (refreshToken) {
  //    this.http.post(`${EndPointConst.LOGOUT}`, {refreshToken})
  //   }
  //   localStorage.removeItem('token');
  //   // this.moveUserOut();
  // }


  // moveUserOut() {
  //   this.isLoggedIn = false;
  //   localStorage.clear();
  //   this.router.navigate(['/']);
  // }

  // jwtDecoder() {
  //   const helper = new JwtHelperService();
  //   let token = this.getAccessToken();
  //   if(token !== '') {
  //   return helper.decodeToken(token);
  //   } else {
  //     return '';
  //   }

  // }
// }
