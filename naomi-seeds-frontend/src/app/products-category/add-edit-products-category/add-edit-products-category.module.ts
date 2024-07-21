import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditProductsCategoryPageRoutingModule } from './add-edit-products-category-routing.module';

import { AddEditProductsCategoryPage } from './add-edit-products-category.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ImageUploadModule } from 'src/app/module/image-upload/image-upload.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditProductsCategoryPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ImageUploadModule
  ],
  declarations: [AddEditProductsCategoryPage]
})
export class AddEditProductsCategoryPageModule {}
