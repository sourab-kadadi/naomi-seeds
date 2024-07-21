import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountantPageRoutingModule } from './accountant-routing.module';

import { AccountantPage } from './accountant.page';
import { SharedModule } from '../shared/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountantPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [AccountantPage]
})
export class AccountantPageModule {}
