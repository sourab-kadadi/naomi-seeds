import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductCreateUpdatePage } from './product-create-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProductCreateUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCreateUpdatePageRoutingModule {}
