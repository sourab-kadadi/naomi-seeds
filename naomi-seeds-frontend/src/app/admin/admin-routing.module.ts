import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'products',
    component: AdminPage,
    children: [
      // {
      //   path: 'products',
      //   loadChildren: () => import('../products/products.module').then( m => m.ProductsPageModule)
      // },
      // {
      //   path: 'inventory-details',
      //   loadChildren: () => import('../inventory_details/inventory-details.module').then( m => m.InventoryDetailsPageModule),
      // },
      {
        path: 'account-statements',
        loadChildren: () => import('./account-statements/account-statements.module').then( m => m.AccountStatementsPageModule)
      },
      {
        path: 'payments-received',
        loadChildren: () => import('./payments-received/payments-received.module').then( m => m.PaymentsReceivedPageModule)
      },
      // {
      //   path: 'user-management',
      //   loadChildren: () => import('./user-management/user-management.module').then( m => m.UserManagementPageModule)
      // },

      // {
      //   path: 'user',
      //   children: [
      //     {
      //       path: 'list',
      //       loadChildren: () => import('./user/list/list.module').then( m => m.ListPageModule)
      //     },
      //     {
      //       path: 'manage',
      //       loadChildren: () => import('./user/manage/manage.module').then( m => m.ManagePageModule)
      //     }
      //   ]
      // },

      // {
      //   path: 'pending-approvals',
      //   loadChildren: () => import('./inventory_details/inventory_details.module').then( m => m.PendingApprovalsPageModule)
      // },
    ]
  },
  {
    path: 'payments-received',
    loadChildren: () => import('./payments-received/payments-received.module').then( m => m.PaymentsReceivedPageModule)
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
