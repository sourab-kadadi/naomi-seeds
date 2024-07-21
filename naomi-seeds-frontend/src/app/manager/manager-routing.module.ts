import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerPage } from './manager.page';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'sales-order',
    component: ManagerPage,
    children: [
      {
        path: 'sales-order',
        loadChildren: () => import('./sales-order/sales-order.module').then( m => m.SalesOrderPageModule)
      },
      {
        path: 'pending-approvals',
        loadChildren: () => import('./pending-approvals/pending-approvals.module').then( m => m.PendingApprovalsPageModule)
      },
      // {
      //   path: ':salesOrderId',
      //   // eslint-disable-next-line max-len
      //   loadChildren: () => import('./sales-order/detail-sales-order/detail-sales-order.module').then( m => m.DetailSalesOrderPageModule)
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerPageRoutingModule {}
