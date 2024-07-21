import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUpdatePageRoutingModule } from './create-update-routing.module';

import { CreateUpdatePage } from './create-update.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUpdatePageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    SharedModule
  ],
  declarations: [CreateUpdatePage]
})
export class CreateUpdatePageModule {}
