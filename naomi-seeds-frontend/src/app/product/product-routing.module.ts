import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLocation } from '../constants/system.const';
import { PermissionCanCreateGuard } from '../guards/permission-can-create.guard';
import { PermissionCanReadGuard } from '../guards/permission-can-read.guard';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage
  },
  {
    path: 'product-list/:productCategoryId',
    loadChildren: () => import('./product-list/product-list.module').then( m => m.ProductListPageModule)
  },
  {
    path: 'product-list/:productCategoryId/create',
    loadChildren: () => import('./product-create-update/product-create-update.module').then( m => m.ProductCreateUpdatePageModule),
    canActivate: [PermissionCanCreateGuard],
    data: {
      mode: 'create',
      permissions: {
        CAN_CREATE: true,
      },
      pageLocation: PageLocation.products
    },
  },
  {
    path: 'product-list/:productCategoryId/update/:productId',
    data: {
      mode: 'update'
    },
    loadChildren: () => import('./product-create-update/product-create-update.module').then( m => m.ProductCreateUpdatePageModule)
  },
  {
    path: 'product-list/product-display/:productId',
    loadChildren: () => import('./product-display/product-display.module').then( m => m.ProductDisplayPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
