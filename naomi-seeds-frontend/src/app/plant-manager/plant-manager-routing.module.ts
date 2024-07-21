import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantManagerPage } from './plant-manager.page';

const routes: Routes = [
  {
    path: '',

    component: PlantManagerPage,
    children: [
      {
        path: 'requirement',
        loadChildren: () => import('./requirement/requirement.module').then( m => m.RequirementPageModule)
      },
      {
        path: 'sales-order',
        loadChildren: () => import('./sales-order/sales-order.module').then( m => m.SalesOrderPageModule)
      },
      // {
      //   path: ':salesOrderId',
      //   // eslint-disable-next-line max-len
      //   loadChildren: () => import('./sales-order/detail-sales-order/detail-sales-order.module').then( m => m.DetailSalesOrderPageModule)
      // },

    ]
  },




];

//   {
//     path: '',
//     component: PlantManagerPage
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantManagerPageRoutingModule {}
