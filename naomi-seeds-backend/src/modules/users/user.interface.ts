import { Document } from 'mongoose';

export interface User extends Document {
   readonly firstName: string,
   readonly lastName: string,
   readonly psw?: string,
   readonly email: string,
   readonly phoneNo: number,
   readonly birthDay: Date;
   readonly roles: any;
   readonly roleGroupRefId: any;
   readonly permissionsData: permissionsData;
   readonly userTypeInternalOrExternal: string;
   readonly userLinkToProfileId: any;
   readonly userJoiningDate: Date;
   readonly userLinkToProfileCompanyName: any;
   readonly zone?: any;

}

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


export class pagePermissionLevels {
   readonly CAN_CREATE: boolean;
   readonly CAN_EDIT: boolean;
   readonly CAN_READ: boolean;
   readonly CAN_DELETE: boolean;
}
