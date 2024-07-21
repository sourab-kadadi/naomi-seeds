import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPackingSizePageRoutingModule } from './product-packing-size-routing.module';

import { ProductPackingSizePage } from './product-packing-size.page';
import { SharedModule } from '../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPackingSizePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    IonicSelectableModule,
  ],
  declarations: [ProductPackingSizePage]
})
export class ProductPackingSizePageModule {}
