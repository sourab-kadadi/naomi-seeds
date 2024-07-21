import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsReceivedPageRoutingModule } from './payments-received-routing.module';

import { PaymentsReceivedPage } from './payments-received.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsReceivedPageRoutingModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [PaymentsReceivedPage]
})
export class PaymentsReceivedPageModule {}
