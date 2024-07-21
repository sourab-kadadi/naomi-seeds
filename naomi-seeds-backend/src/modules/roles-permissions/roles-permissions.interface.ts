import { Document } from 'mongoose';
import { PERMISSION_CATEGORIES } from '../roles-permissions/roles-permissions.enum';



export interface RolesPermissions extends Document {
    readonly roleName: string;
    readonly userTypeInternalOrExternal: string;
    readonly roleSeniorityLevel: number;
    // readonly rolesAndPermissionsData: rolesAndPermissionsData;
        readonly permissionsData: permissionsData;
}

export interface RolesSeniorityLevel extends Document {
  readonly roleName: string;
  readonly userTypeInternalOrExternal: string;
  readonly roleSeniorityLevel: number;
}

export interface RoleGroups extends Document {
  readonly roleName: string;
  readonly userTypeInternalOrExternal: string;
}



// export interface rolesAndPermissionsData {
//     readonly products: products,
//     readonly lotData: lotData,
//     readonly salesOrders: salesOrders,
//     readonly requirementData: requirementData,
//     readonly paymentsReceived: paymentsReceived,
//     readonly users: users,
//     readonly rolesAndPermissionsPageAccess: rolesAndPermissionsPageAccess,
//   }
  
  export interface permissionsData {
    readonly products: pagePermissionLevels,
    readonly productPackingSize: pagePermissionLevels,
    readonly productsCategory: pagePermissionLevels,
    readonly lotData: pagePermissionLevels,
    readonly salesOrders: pagePermissionLevels,
    readonly requirementData: pagePermissionLevels,
    readonly paymentsReceived: pagePermissionLevels,
    readonly users: pagePermissionLevels,
    readonly profilePage: pagePermissionLevels,
    readonly rolesAndPermissionsPageAccess: pagePermissionLevels,
  }

  export interface pagePermissionLevels {
    readonly CAN_CREATE: boolean,
    readonly CAN_EDIT: boolean,
    readonly CAN_READ: boolean,
    readonly CAN_DELETE: boolean
  }

