import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesOfficerPageRoutingModule } from './sales-officer-routing.module';

import { SalesOfficerPage } from './sales-officer.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesOfficerPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SalesOfficerPage]
})
export class SalesOfficerPageModule {}
