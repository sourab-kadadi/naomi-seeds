import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';
import { SplitMenuProfileDataComponent } from './split-menu-profile-data/split-menu-profile-data.component';
import { SharedModule } from '../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [SplitMenuProfileDataComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    IonicSelectableModule

  ],
  exports: [
    SplitMenuProfileDataComponent,
  ]
})
export class ComponentsModule { }
