import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLocation } from '../constants/system.const';
import { PermissionCanCreateGuard } from '../guards/permission-can-create.guard';

import { ProductPackingSizePage } from './product-packing-size.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPackingSizePage
  },
  {
    path: 'create',
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule),
    canActivate: [PermissionCanCreateGuard],
    data: {
      mode: 'create',
      permissions: {
        CAN_CREATE: true,
      },
      pageLocation: PageLocation.productPackingSize,
    }, 
  },
  {
    path: 'update/:productPackingSizeId',
    data: {
      mode: 'update'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPackingSizePageRoutingModule {}
