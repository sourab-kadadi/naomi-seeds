import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesOfficerPage } from './sales-officer.page';

const routes: Routes = [
  // { path: '',
  //   redirectTo: 'delivery-challan',
  //   // match: full,
  // },

  {
    path: '',
    component: SalesOfficerPage,
    children: [
      {
        path: 'requirement',
        loadChildren: () => import('./requirement/requirement.module').then( m => m.RequirementPageModule)
      },
      {
        path: 'sales-order',
        loadChildren: () => import('./sales-order/sales-order.module').then( m => m.SalesOrderPageModule)
      },
      {
        path: 'pending-approvals',
        loadChildren: () => import('./pending-approvals/pending-approvals.module').then( m => m.PendingApprovalsPageModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule)
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
export class SalesOfficerPageRoutingModule {}
