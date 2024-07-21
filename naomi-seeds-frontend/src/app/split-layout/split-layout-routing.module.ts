/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthAdminGuard } from '../login/authGuards/auth-admin.guard';
import { AuthManagerGuard } from '../login/authGuards/auth-manager.guard';
import { AuthSalesOfficerGuard } from '../login/authGuards/auth-sales-officer.guard';
import { AuthDistributorGuard } from '../login/authGuards/auth-distributor.guard';
import { AuthAccountantGuard } from '../login/authGuards/auth-accountant.guard';
import { AuthPlantManagerGuard } from '../login/authGuards/auth-plant-manager.guard';


import { SplitLayoutPage } from './split-layout.page';
import { AuthGuard } from '../login/auth.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CustomGuard } from '../guards/custom.guard';

import { PageLocation } from '../constants/system.const';
import { PermissionCanReadGuard } from '../guards/permission-can-read.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SplitLayoutPage,
    children: [
      {
        path: 'products-category',
        loadChildren: () => import('../products-category/products-category.module').then( m => m.ProductsCategoryPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.productsCategory
        }
      },
      // {
      //   path: 'products',
      //   loadChildren: () => import('../products/products.module').then(m => m.ProductsPageModule),
      //   // canActivate: [CustomGuard],
      //   canActivate: [PermissionCanReadGuard],
      //   data: {
      //     permissions: {
      //       CAN_READ: true,
      //     },
      //     pageLocation: PageLocation.products
      //   }
      //   // canActivate: [ AuthGuard],
      //   // data: {
      //   // role: ["ADMIN", "MANAGER"]
      //   // role: ["MANAGER"]
      //   // },
      // },

      // canActivate: [ AuthDistributorGuard]
      // canActivate: [AuthAdminGuard, AuthManagerGuard, AuthSalesOfficerGuard, AuthDistributorGuard, AuthAccountantGuard,
      //   AuthPlantManagerGuard]
      // },
      {
        path: 'product',
        loadChildren: () => import('../product/product.module').then( m => m.ProductPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.products
        }
      },
      {
        path: 'product-packing-size',
        loadChildren: () => import('../product-packing-size/product-packing-size.module').then( m => m.ProductPackingSizePageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.productPackingSize
        }
      },
   
     {
        path: 'role-and-permission-management',
        loadChildren: () => import('../role-and-permission-management/role-and-permission-management.module').then(m => m.RoleAndPermissionManagementPageModule)
      },
      // {
      //   path: 'role-and-permission-management',
      //   loadChildren: () => import('../role-and-permission-management/role-and-permission-management.module').then(m => m.RoleAndPermissionManagementPageModule)
      // },
      {
        path: 'profile-management',
        loadChildren: () => import('../profile-management/profile-management.module').then( m => m.ProfileManagementPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.profilePage
        }
      },
      {
        path: 'users-management',
        loadChildren: () => import('../users-management/users-management.module').then( m => m.UsersManagementPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.users
        }
      
      },
      {
        path: 'products-lot-page',
        loadChildren: () => import('../products-lot-page/products-lot-page.module').then( m => m.ProductsLotPagePageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.lotData
        }
      },
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then( m => m.OrdersPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.salesOrders
        }
      },
      {
        path: 'account-statements',
        loadChildren: () => import('../account-statements/account-statements.module').then( m => m.AccountStatementsPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.products
        }
      },
      {
        path: 'payment',
        loadChildren: () => import('../payment/payment.module').then( m => m.PaymentPageModule),
        canActivate: [PermissionCanReadGuard],
        data: {
          permissions: {
            CAN_READ: true,
          },
          pageLocation: PageLocation.paymentsReceived
        }
      },

      // {
      //   path: 'user-management',
      //   loadChildren: () => import('./user-management/user-management.module').then( m => m.UserManagementPageModule)
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitLayoutPageRoutingModule { }
