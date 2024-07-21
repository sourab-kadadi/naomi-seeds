import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePaymentsPageRoutingModule } from './update-payments-routing.module';

import { UpdatePaymentsPage } from './update-payments.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatePaymentsPageRoutingModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [UpdatePaymentsPage]
})
export class UpdatePaymentsPageModule {}
