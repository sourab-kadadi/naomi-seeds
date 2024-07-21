import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateApprovePaymentsPageRoutingModule } from './update-approve-payments-routing.module';

import { UpdateApprovePaymentsPage } from './update-approve-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateApprovePaymentsPageRoutingModule
  ],
  declarations: [UpdateApprovePaymentsPage]
})
export class UpdateApprovePaymentsPageModule {}
