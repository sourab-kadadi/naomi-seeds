import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSalesOrderPageRoutingModule } from './detail-sales-order-routing.module';
import { SharedModule } from '../../../shared/shared/shared.module';
import { DetailSalesOrderPage } from './detail-sales-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSalesOrderPageRoutingModule,
    SharedModule
  ],
  declarations: [DetailSalesOrderPage]
})
export class DetailSalesOrderPageModule {}
