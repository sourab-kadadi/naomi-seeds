import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUpdatePageRoutingModule } from './create-update-routing.module';

import { CreateUpdatePage } from './create-update.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUpdatePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [CreateUpdatePage]
})
export class CreateUpdatePageModule {}
