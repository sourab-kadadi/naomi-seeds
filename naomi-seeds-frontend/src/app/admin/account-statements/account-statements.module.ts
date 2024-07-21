import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountStatementsPageRoutingModule } from './account-statements-routing.module';

import { AccountStatementsPage } from './account-statements.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountStatementsPageRoutingModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [AccountStatementsPage]
})
export class AccountStatementsPageModule {}
