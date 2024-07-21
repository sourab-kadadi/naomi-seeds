import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditProductsCategoryPage } from './add-edit-products-category.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditProductsCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditProductsCategoryPageRoutingModule {}
