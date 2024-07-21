import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplitLayoutPageRoutingModule } from './split-layout-routing.module';

import { SplitLayoutPage } from './split-layout.page';
import { SharedModule } from '../shared/shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { AuthAdminGuard } from '../login/authGuards/auth-admin.guard';
import { AuthManagerGuard } from '../login/authGuards/auth-manager.guard';
import { AuthSalesOfficerGuard } from '../login/authGuards/auth-sales-officer.guard';
import { AuthDistributorGuard } from '../login/authGuards/auth-distributor.guard';
import { AuthAccountantGuard } from '../login/authGuards/auth-accountant.guard';
import { AuthPlantManagerGuard } from '../login/authGuards/auth-plant-manager.guard';
import { AuthGuard } from '../login/auth.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplitLayoutPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [SplitLayoutPage],
  providers: [
    AuthAdminGuard, AuthManagerGuard, AuthSalesOfficerGuard, AuthDistributorGuard, AuthAccountantGuard,
      AuthPlantManagerGuard, AuthGuard ],
})
export class SplitLayoutPageModule {}
