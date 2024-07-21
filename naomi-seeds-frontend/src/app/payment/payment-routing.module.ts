import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentPage } from './payment.page';
import { PageLocation } from '../constants/system.const';

const routes: Routes = [
  {
    path: '',
    component: PaymentPage
  },
  {
    path: 'manage',
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule),
    data: {
      mode: 'create',
      permissions: {
        CAN_CREATE: true,
      },
      pageLocation: PageLocation.paymentsReceived
    },
  },
  {
    path: 'manage/:paymentId',
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule),
    data: {
      mode: 'update',
      permissions: {
        CAN_EDIT: true,
      },
      pageLocation: PageLocation.paymentsReceived
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentPageRoutingModule {}
