// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { map } from 'rxjs/operators';
// import { EndPointConst } from '../../constants/end-point.const';
// import { JwtHelperService } from "@auth0/angular-jwt";
// import { ConstantPool } from '@angular/compiler';
// import { Observable } from 'rxjs';
// import { StorageService } from './storage.service';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthServiceService {
//   tokenData: any;
//   roleAs: string;
//   isLoggedIn: boolean = false;
//   loggedInState: any;
//   isLogin: boolean = false;
//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     public ionStorage: StorageService
//   ) { }


//   async isUserLoggedIn() {
//     let getSession: any = await this.ionStorage.get("token");
//     console.log(getSession)
//     if (getSession) {
//       this.isLoggedIn = true;
//       return getSession;
//     }
//     this.isLoggedIn = false;
//     return '';
//   }


//   async getAccessToken() {
//     let getSession: any = await this.ionStorage.get("token");
//     console.log(getSession)
//     if (getSession) {
//       this.isLoggedIn = true;
//       return getSession;
//     }
//     this.isLoggedIn = false;
//     return '';
//   }

//   refreshToken(refreshToken: string): any {
//     if (refreshToken) {
//       return this.http.post(`${EndPointConst.REFRESH_TOKEN}`, { refreshToken: refreshToken });
//     } else {
//       this.moveUserOut();
//       return null;
//     }
//   }


//   async logout() {
//     const token = JSON.parse(localStorage.getItem('refreshToken') || '{}');
//     const refreshToken = token;
//     if (refreshToken) {
//       this.http.post(`${EndPointConst.LOGOUT}`, { refreshToken: refreshToken })
//     }
//     await this.ionStorage.clear("token");
//     await this.ionStorage.clear("refreshToken");
//   }


//   moveUserOut() {
//     this.isLoggedIn = false;
//     localStorage.clear();
//     this.router.navigate(['/']);
//   }

//   async jwtDecoder() {
//     const helper = new JwtHelperService();
//     let token = await this.getAccessToken();
//     // console.log(token);
//     if (token != '') {
//       return helper.decodeToken(token);
//     } else {
//       return '';
//     }
//   }

//   getRole() {
//     this.ionStorage.getTokenData().then(res => {
//       this.tokenData = res;
//       this.roleAs = this.tokenData.roles[0];
//       return this.roleAs;
//     }
//     );
//   }




// }
