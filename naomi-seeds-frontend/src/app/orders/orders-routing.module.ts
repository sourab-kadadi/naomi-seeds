import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';
import { PageLocation } from '../constants/system.const';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  },
  {
    path: 'manage',
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule),
    data: {
      mode: 'create',
      permissions: {
        CAN_CREATE: true,
      },
      pageLocation: PageLocation.salesOrders
    },
  },
  {
    path: 'manage/:orderId',
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule),
    data: {
      mode: 'update'
    },
  },
  {
    path: 'order-detail-page/:orderId',
    loadChildren: () => import('./detail-page/detail-page.module').then( m => m.DetailPagePageModule),
    data: {
      permissions: {
        CAN_READ: true,
      },
      pageLocation: PageLocation.salesOrders
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule {}
