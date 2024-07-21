import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountantPage } from './accountant.page';

const routes: Routes = [
  {
    path: '',
    component: AccountantPage,
    children: [
      {
        path: 'payments-received',
        loadChildren: () => import('./payments-received/payments-received.module').then( m => m.PaymentsReceivedPageModule)
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountantPageRoutingModule {}
