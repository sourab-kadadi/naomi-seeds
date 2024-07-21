import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUpdatePageRoutingModule } from './create-update-routing.module';

import { CreateUpdatePage } from './create-update.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUpdatePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    IonicSelectableModule,
  ],
  declarations: [CreateUpdatePage]
})
export class CreateUpdatePageModule {}
