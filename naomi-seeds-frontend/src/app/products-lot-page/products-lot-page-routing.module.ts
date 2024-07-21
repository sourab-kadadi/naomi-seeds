import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsLotPagePage } from './products-lot-page.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsLotPagePage
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  },
  {
    path: 'update/:productLotId',
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
export class ProductsLotPagePageRoutingModule {}
