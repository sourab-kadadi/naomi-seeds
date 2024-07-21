import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './login/auth.guard';
import { AuthAccountantGuard } from './login/authGuards/auth-accountant.guard';
import { AuthAdminGuard } from './login/authGuards/auth-admin.guard';
import { AuthDistributorGuard } from './login/authGuards/auth-distributor.guard';
import { AuthManagerGuard } from './login/authGuards/auth-manager.guard';
import { AuthPlantManagerGuard } from './login/authGuards/auth-plant-manager.guard';
import { AuthSalesOfficerGuard } from './login/authGuards/auth-sales-officer.guard';
// import { title } from 'process';
// import { AutoLoginGuard } from './guards/auto-login/auto-login.guard';

const routes: Routes = [



  {
    path: '',
    redirectTo: 'login',
        // redirectTo: 'login',
        // redirectTo: 'admin',

        // children: [],
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./split-layout/split-layout.module').then( m => m.SplitLayoutPageModule)
  },
  {
    path: 'add-edit-products-category',
    loadChildren: () => import('./products-category/add-edit-products-category/add-edit-products-category.module').then( m => m.AddEditProductsCategoryPageModule)
  },
  {
    path: 'products-category',
    loadChildren: () => import('./products-category/products-category.module').then( m => m.ProductsCategoryPageModule)
  },
  {
    path: 'users-management',
    loadChildren: () => import('./users-management/users-management.module').then( m => m.UsersManagementPageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'product-packing-size',
    loadChildren: () => import('./product-packing-size/product-packing-size.module').then( m => m.ProductPackingSizePageModule)
  },
  {
    path: 'products-lot-page',
    loadChildren: () => import('./products-lot-page/products-lot-page.module').then( m => m.ProductsLotPagePageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },



  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
  //   canActivate: [AuthAdminGuard]
  // },
  // {
  //   path: 'sales-officer',
  //   loadChildren: () => import('./sales-officer/sales-officer.module').then( m => m.SalesOfficerPageModule),
  //   canActivate: [AuthSalesOfficerGuard]
  // },
  // {
  //   path: 'distributor',
  //   loadChildren: () => import('./distributor/distributor.module').then( m => m.DistributorPageModule),
  //   canActivate: [AuthDistributorGuard]
  // },
  // {
  //   path: 'accountant',
  //   loadChildren: () => import('./accountant/accountant.module').then( m => m.AccountantPageModule),
  //   canActivate: [AuthAccountantGuard]
  // },
  // {
  //   path: 'manager',
  //   loadChildren: () => import('./manager/manager.module').then( m => m.ManagerPageModule),
  //   canActivate: [AuthManagerGuard],
  // },
  // {
  //   path: 'plant-manager',
  //   loadChildren: () => import('./plant-manager/plant-manager.module').then( m => m.PlantManagerPageModule),
  //   canActivate: [AuthPlantManagerGuard],
  // },






  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },







//lat
  // {
  //   path: 'products',

  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  //     },
  //     {
  //       path: ':productId',
  //       loadChildren: () => import('./products/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  //     },
  //     {
  //       path: 'product-add',
  //       loadChildren: () => import('./products/product-add/product-add.module').then( m => m.ProductAddPageModule)
  //     }

  //   ]
  // },
  // {
  //   path: 'distributors',

  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./distributors/distributors.module').then( m => m.DistributorsPageModule)
  //     },

  //   ]
  // },






  // // {
  // //   path: 'product',
  // //   loadChildren: () => import('./product/list/list.module').then( m => m.ListPageModule),
  // // },
  // // {
  // //   path: 'product-manage',
  // //   loadChildren: () => import('./product/manage/manage.module').then( m => m.ManagePageModule)
  // // },
  // {
  //   path: "user",
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
  //   path: 'delivery-challan',
  //   loadChildren: () => import('./sales/delivery-challan/delivery-challan.module').then( m => m.DeliveryChallanPageModule)
  // },



  // {
  //   path: 'products',

  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  //     },
  //     {
  //       path: ':productId',
  //       loadChildren: () => import('./products/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  //     },
  //     {
  //       path: 'product-add',
  //       loadChildren: () => import('./products/product-add/product-add.module').then( m => m.ProductAddPageModule)
  //     },
  //     {
  //       path: 'product-add',
  //       loadChildren: () => import('./products/product-add/product-add.module').then( m => m.ProductAddPageModule)
  //     },
  //     {
  //     path: 'product-edit/:productId',
  //     loadChildren: () => import('./products/product-edit/product-edit.module').then( m => m.ProductEditPageModule)
  //     }

  //   ]
  // },



  // {
  //   path: 'inventory-details',

  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./inventory_details/inventory-details.module').then( m => m.InventoryDetailsPageModule)
  //     },
  //     {
  //       path: ':productId',
  //       // eslint-disable-next-line max-len
  //       loadChildren: () => import('./inventory_details/display-inventory/display-inventory.module').then( m => m.DisplayInventoryPageModule)
  //     },

  //     {
  //       path: ':productId/add-inventory',
  //       // eslint-disable-next-line max-len
  //       loadChildren: () => import('./inventory_details/display-inventory/add-inventory/add-inventory.module').then( m => m.AddInventoryPageModule)
  //     },
  //     {
  //       path: ':productId/:inventoryId',
  //       // eslint-disable-next-line max-len
  //       loadChildren: () => import('./inventory_details/display-inventory/display-lotdetails/display-lotdetails.module').then( m => m.DisplayLotdetailsPageModule)
  //     },

  //   ]
  // },



  // {
  //   path: 'sales-order',

  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./sales-order/sales-order.module').then( m => m.SalesOrderPageModule)
  //     },
  //     {
  //       path: ':salesOrderId',
  //       // eslint-disable-next-line max-len
  //       loadChildren: () => import('./sales-order/detail-sales-order/detail-sales-order.module').then( m => m.DetailSalesOrderPageModule)
  //     },
  //   ]
  // },















  // {
  //   path: 'sales',
  //   loadChildren: () => import('./sales/sales.module').then( m => m.SalesPageModule)
  // },











  // {
  //   path: 'distributors',
  //   loadChildren: () => import('./distributors/distributors.module').then( m => m.DistributorsPageModule)
  // },





];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
