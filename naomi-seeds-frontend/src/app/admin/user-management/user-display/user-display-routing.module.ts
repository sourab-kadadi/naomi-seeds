import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDisplayPage } from './user-display.page';

const routes: Routes = [
  {
    path: '',
    component: UserDisplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDisplayPageRoutingModule {}
