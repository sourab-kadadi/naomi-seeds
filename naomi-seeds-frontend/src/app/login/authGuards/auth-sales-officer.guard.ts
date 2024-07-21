import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSalesOfficerGuard implements CanActivate {


  constructor(public authService: AuthService, public router: Router) {}
  canActivate(): boolean {
      const token = this.authService.jwtDecoder();
    // if (!token || token === '' || token.roles[0] !== 'SALES_OFFICER') {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    return true;
  }

}
