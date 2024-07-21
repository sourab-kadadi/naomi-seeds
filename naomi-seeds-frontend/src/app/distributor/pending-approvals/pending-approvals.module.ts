import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingApprovalsPageRoutingModule } from './pending-approvals-routing.module';

import { PendingApprovalsPage } from './pending-approvals.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingApprovalsPageRoutingModule,
    IonicSelectableModule,
    SharedModule
  ],
  declarations: [PendingApprovalsPage]
})
export class PendingApprovalsPageModule {}
