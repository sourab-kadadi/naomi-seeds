import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistributorPageRoutingModule } from './distributor-routing.module';

import { DistributorPage } from './distributor.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistributorPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DistributorPage]
})
export class DistributorPageModule {}
