import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountStatementsPage } from './account-statements.page';

const routes: Routes = [
  {
    path: '',
    component: AccountStatementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountStatementsPageRoutingModule {}
