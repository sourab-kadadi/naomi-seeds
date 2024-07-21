import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateApprovePaymentsPage } from './update-approve-payments.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateApprovePaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateApprovePaymentsPageRoutingModule {}
