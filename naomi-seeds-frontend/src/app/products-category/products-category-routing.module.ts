import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsCategoryPage } from './products-category.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsCategoryPage
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    loadChildren: () => import('./add-edit-products-category/add-edit-products-category.module').then( m => m.AddEditProductsCategoryPageModule)
  },
  {
    path: 'update/:productCategoryId',
    data: {
      mode: 'update'
    },
    loadChildren: () => import('./add-edit-products-category/add-edit-products-category.module').then( m => m.AddEditProductsCategoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsCategoryPageRoutingModule {}
