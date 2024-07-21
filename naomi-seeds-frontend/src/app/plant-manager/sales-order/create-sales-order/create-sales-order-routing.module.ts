import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSalesOrderPage } from './create-sales-order.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSalesOrderPage
  },
  {
    path: 'add-item',
    loadChildren: () => import('./add-item/add-item.module').then( m => m.AddItemPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSalesOrderPageRoutingModule {}
