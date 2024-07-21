import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemOrderDetailsPageRoutingModule } from './item-order-details-routing.module';

import { ItemOrderDetailsPage } from './item-order-details.page';
import { SharedModule } from '../../../../shared/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemOrderDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [ItemOrderDetailsPage]
})
export class ItemOrderDetailsPageModule {}
