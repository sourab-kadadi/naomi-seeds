import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesOrderPageRoutingModule } from './sales-order-routing.module';

import { SalesOrderPage } from './sales-order.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../../shared/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesOrderPageRoutingModule,
    IonicSelectableModule,
    SharedModule
  ],
  declarations: [SalesOrderPage]
})
export class SalesOrderPageModule {}
