import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantManagerPageRoutingModule } from './plant-manager-routing.module';

import { PlantManagerPage } from './plant-manager.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantManagerPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlantManagerPage]
})
export class PlantManagerPageModule {}
