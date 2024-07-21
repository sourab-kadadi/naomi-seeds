import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateUpdatePage } from './create-update.page';

const routes: Routes = [
  {
    path: '',
    component: CreateUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateUpdatePageRoutingModule {}
