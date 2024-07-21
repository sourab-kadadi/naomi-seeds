import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsReceivedPage } from './payments-received.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsReceivedPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'update-approve-payments',
    loadChildren: () => import('./update-approve-payments/update-approve-payments.module').then( m => m.UpdateApprovePaymentsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsReceivedPageRoutingModule {}
