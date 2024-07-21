import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSalesOrderPageRoutingModule } from './create-sales-order-routing.module';

import { CreateSalesOrderPage } from './create-sales-order.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSalesOrderPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule
  ],
  declarations: [CreateSalesOrderPage]
})
export class CreateSalesOrderPageModule {}
