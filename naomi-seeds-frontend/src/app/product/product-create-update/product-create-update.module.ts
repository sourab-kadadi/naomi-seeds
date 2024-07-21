import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCreateUpdatePageRoutingModule } from './product-create-update-routing.module';

import { ProductCreateUpdatePage } from './product-create-update.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCreateUpdatePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    IonicSelectableModule,
  ],
  declarations: [ProductCreateUpdatePage]
})
export class ProductCreateUpdatePageModule {}
