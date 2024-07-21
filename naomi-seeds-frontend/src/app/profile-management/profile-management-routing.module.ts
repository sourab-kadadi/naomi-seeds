import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileManagementPage } from './profile-management.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileManagementPage
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  },
  {
    path: 'update/:profileId',
    data: {
      mode: 'update'
    },
    loadChildren: () => import('./create-update/create-update.module').then( m => m.CreateUpdatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileManagementPageRoutingModule {}
