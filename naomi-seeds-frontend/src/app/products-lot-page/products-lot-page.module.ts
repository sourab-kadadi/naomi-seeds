import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsLotPagePageRoutingModule } from './products-lot-page-routing.module';

import { ProductsLotPagePage } from './products-lot-page.page';
import { SharedModule } from '../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsLotPagePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    IonicSelectableModule,
  ],
  declarations: [ProductsLotPagePage]
})
export class ProductsLotPagePageModule {}
