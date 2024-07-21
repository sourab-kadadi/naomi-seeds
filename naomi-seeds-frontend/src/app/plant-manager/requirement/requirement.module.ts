import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementPageRoutingModule } from './requirement-routing.module';

import { RequirementPage } from './requirement.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequirementPageRoutingModule,
    SharedModule,
    IonicSelectableModule,
  ],
  declarations: [RequirementPage]
})
export class RequirementPageModule {}
