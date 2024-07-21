import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './service/service/http-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpServerService } from '../app/service/service/http-server.service';
import { IonicSelectableModule } from 'ionic-selectable';
import {DatePipe} from '@angular/common';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './constants/system.const';
import { AuthService } from './login/auth.service';
import { AuthAdminGuard } from './login/authGuards/auth-admin.guard';
import { AuthManagerGuard } from './login/authGuards/auth-manager.guard';
import { AuthSalesOfficerGuard } from './login/authGuards/auth-sales-officer.guard';
import { AuthDistributorGuard } from './login/authGuards/auth-distributor.guard';
import { AuthAccountantGuard } from './login/authGuards/auth-accountant.guard';
import { AuthPlantManagerGuard } from './login/authGuards/auth-plant-manager.guard';
import { SwiperModule } from 'swiper/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxPermissionsModule } from 'ngx-permissions';
import { YesNoPipe } from './shared/pipes/yes-no.pipe'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        SwiperModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxPermissionsModule.forRoot(),
        NgxUiLoaderHttpModule.forRoot({
            showForeground: true,
        }),
        IonicStorageModule.forRoot()
    ],
    providers: [HttpServerService, DatePipe, { provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy }, { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
        AuthService, AuthAdminGuard, AuthManagerGuard, AuthSalesOfficerGuard, AuthDistributorGuard, AuthAccountantGuard,
        AuthPlantManagerGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
