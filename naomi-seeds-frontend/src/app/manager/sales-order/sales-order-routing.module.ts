import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesOrderPage } from './sales-order.page';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderPage
  },
  {
    path: 'create-sales-order',
    loadChildren: () => import('./create-sales-order/create-sales-order.module').then( m => m.CreateSalesOrderPageModule)
  },
  {
    path: ':salesOrderId',
    loadChildren: () => import('./detail-sales-order/detail-sales-order.module').then( m => m.DetailSalesOrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesOrderPageRoutingModule {}
