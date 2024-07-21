import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsReceivedPageRoutingModule } from './payments-received-routing.module';

import { PaymentsReceivedPage } from './payments-received.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsReceivedPageRoutingModule
  ],
  declarations: [PaymentsReceivedPage]
})
export class PaymentsReceivedPageModule {}
