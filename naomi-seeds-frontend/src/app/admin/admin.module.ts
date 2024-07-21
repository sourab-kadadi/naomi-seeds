import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';

// import { AdminComponent} from './admin.component';
import { SharedModule } from '../shared/shared/shared.module';
import { ComponentsModule } from '../components/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  // declarations: [AdminPage, AdminComponent]
  declarations: [AdminPage]
})
export class AdminPageModule {}
