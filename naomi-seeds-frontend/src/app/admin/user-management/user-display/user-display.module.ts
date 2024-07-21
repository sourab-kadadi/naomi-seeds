import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDisplayPageRoutingModule } from './user-display-routing.module';

import { UserDisplayPage } from './user-display.page';
import { SharedModule } from '../../../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserDisplayPageRoutingModule,
    SharedModule
  ],
  declarations: [UserDisplayPage]
})
export class UserDisplayPageModule {}
