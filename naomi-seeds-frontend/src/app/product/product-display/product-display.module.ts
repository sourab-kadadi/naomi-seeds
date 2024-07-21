import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDisplayPageRoutingModule } from './product-display-routing.module';

import { ProductDisplayPage } from './product-display.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDisplayPageRoutingModule,
    SharedModule,
    SwiperModule
  ],
  declarations: [ProductDisplayPage]
})
export class ProductDisplayPageModule {}
