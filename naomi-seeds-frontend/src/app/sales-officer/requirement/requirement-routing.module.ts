import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequirementPage } from './requirement.page';

const routes: Routes = [
  {
    path: '',
    component: RequirementPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementPageRoutingModule {}
