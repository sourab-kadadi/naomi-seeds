import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistributorPage } from './distributor.page';

const routes: Routes = [
  {
    path: '',

    component: DistributorPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
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


  // {
  //   path: 'products',

  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  //     },
  //     {
  //       path: ':productId',
  //       loadChildren: () => import('./products/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  //     },
  //     // {
  //     //   path: 'product-add',
  //     //   loadChildren: () => import('./products/product-add/product-add.module').then( m => m.ProductAddPageModule)
  //     // }

  //   ]
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributorPageRoutingModule {}
