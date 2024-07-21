import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSalesOrderPage } from './detail-sales-order.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSalesOrderPage
  },
  {
    path: ':itemId',
    loadChildren: () => import('./item-order-details/item-order-details.module').then( m => m.ItemOrderDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSalesOrderPageRoutingModule {}
