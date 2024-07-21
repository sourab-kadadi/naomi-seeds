import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleAndPermissionManagementPage } from './role-and-permission-management.page';

const routes: Routes = [
  {
    path: '',
    component: RoleAndPermissionManagementPage
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  },
  {
    path: 'update/:roleId',
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
export class RoleAndPermissionManagementPageRoutingModule {}
