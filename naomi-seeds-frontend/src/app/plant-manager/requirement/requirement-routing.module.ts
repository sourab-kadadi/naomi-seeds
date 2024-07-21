import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequirementPage } from './requirement.page';

const routes: Routes = [
  {
    path: '',
    component: RequirementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementPageRoutingModule {}
