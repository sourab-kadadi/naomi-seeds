import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsReceivedPage } from './payments-received.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsReceivedPage
  },
  {
    path: ':paymentId',
    loadChildren: () => import('./update-payments/update-payments.module').then( m => m.UpdatePaymentsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsReceivedPageRoutingModule {}
