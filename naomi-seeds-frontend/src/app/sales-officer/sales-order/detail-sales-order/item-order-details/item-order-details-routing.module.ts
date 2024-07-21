import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemOrderDetailsPage } from './item-order-details.page';

const routes: Routes = [
  {
    path: '',
    component: ItemOrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemOrderDetailsPageRoutingModule {}
