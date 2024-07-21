import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsCategoryPageRoutingModule } from './products-category-routing.module';

import { ProductsCategoryPage } from './products-category.page';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsCategoryPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ProductsCategoryPage]
})
export class ProductsCategoryPageModule {}
