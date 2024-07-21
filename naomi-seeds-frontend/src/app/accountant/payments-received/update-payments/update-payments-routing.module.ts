import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePaymentsPage } from './update-payments.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePaymentsPageRoutingModule {}
