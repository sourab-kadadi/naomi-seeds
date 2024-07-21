import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersManagementPage } from './users-management.page';

const routes: Routes = [
  {
    path: '',
    component: UsersManagementPage
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  },
  {
    path: 'update/:userId',
    data: {
      mode: 'update'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersManagementPageRoutingModule {}
