import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { PERMISSION_CATEGORIES } from "./roles-permissions.enum";
import { RoleGroups, RolesPermissions, RolesSeniorityLevel } from "./roles-permissions.interface";


export class CreateRolesPermissionsDto {
    roleName: string;
    userTypeInternalOrExternal: string;
    roleSeniorityLevel: number;
    permissionsData: permissionsData;
}

export class UpdateRolesPermissionsDto {
    roleName: string;
    userTypeInternalOrExternal: string;
    permissionsData: permissionsData;
}

export class permissionsData {
    products: pagePermissionLevels;
    productPackingSize: pagePermissionLevels;
    productsCategory: pagePermissionLevels; 
    lotData: pagePermissionLevels;
    salesOrders: pagePermissionLevels;
    requirementData: pagePermissionLevels;
    paymentsReceived: pagePermissionLevels;
    users: pagePermissionLevels;
    profilePage: pagePermissionLevels;
    rolesAndPermissionsPageAccess: pagePermissionLevels;
}

export class pagePermissionLevels {
    CAN_CREATE: boolean;
    CAN_EDIT: boolean;
    CAN_READ: boolean;
    CAN_DELETE: boolean;
}












export enum IRolesPermissionsDataMessage {
    createdSuccess = "Roles and Permission Data Saved Successfully",
    updateSuccess = "Roles and Permission Details Updated Successfully",
    deleteSuccess = "Roles and Permission Details Deleted Successfully",
    foundSuccess = "Roles and Permission Details Found Successfully",
    notFound = "Roles and Permission Details Not Found",
    failedUnauthorisedAccessCreate = "Unauthorised Access, Roles and Permission  Data Creation failed",
    // failedUnauthorisedAccessUpdate = "Unauthorised Access, Lot Data Updation failed",
    // failedUnauthorisedAccessDelete = "Unauthorised Access, Lot Data deletion failed",
    failedUnauthorisedAccessFind = "Unauthorised Access, Roles and Permission Data access failed",

}

export class IRolesPermissionsDatafindOneByIdRes extends IModuleRes {
    data: RolesPermissions;
}

export class IRolesSeniorityLevelDataRes extends IModuleRes {
    data: RolesSeniorityLevel[];
}



export class IRolesPermissionsDatafindManyRes extends IModuleRes  {
    data: RolesPermissions[];
    totalCount: number;
}

export class IRoleGroupsDatafindManyRes extends IModuleRes  {
    data: RoleGroups[];

}

export enum IDashBoardSummary {
    dashBoardSummarySuccess = 'Dashboard summary fetched Successfully',
    dashBoardSummaryFailed = 'Overview is not available for this period. Please check the selected dates !!!',
    dateError = 'Please select the From and To date correctly !!'
  }
  