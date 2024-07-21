export enum PERMISSION_CATEGORIES {
  CAN_READ = 'CAN_READ', 
  CAN_CREATE = "CAN_CREATE",
CAN_EDIT = "CAN_EDIT",
CAN_DELETE = "CAN_DELETE",
}

//   export enum IRoleMessage {
//     unAuthorisedAccess = "Unauthorised Access",
// }



export enum UserTypeInternalOrExternal {
  INTERNAL_USER = 'INTERNAL_USER',
  // INTERNAL_MANAGEMENT = 'INTERNAL_MANAGEMENT',  
  EXTERNAL_USER = 'EXTERNAL_USER',
  ADMIN = 'ADMIN'
}

// Internanal management is director, manager, operational manager
//internal user is sales officer
// external user is distributor
//all masters can be created only by admin



export enum PageLocation {
  productsCategory = 'productsCategory',
  products = 'products',
  productPackingSize = 'productPackingSize',
  lotData = 'lotData',
  salesOrders = 'salesOrders',
  requirementData = 'requirementData',
  paymentsReceived = 'paymentsReceived',
  users = 'users',
  profilePage = 'profilePage',
  rolesAndPermissionsPageAccess = 'rolesAndPermissionsPageAccess',
}
