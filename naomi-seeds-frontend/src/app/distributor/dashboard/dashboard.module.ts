import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from 'src/app/components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    IonicSelectableModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
