import { IsNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';
import { IModuleRes } from '../../common.service';
import { ORDER } from './orders.interface';


export class CreateOrderDto {
  orderFromProfileId: any;
  orderFromProfileName: string;
  orderFromProfileRole: string;
  orderToProfileId: any;
  orderToProfileName: string;
  orderToProfileRole: string;
  orderType: string;
  orderDate: Date;
  items: ItemDetail[];
  totalUnits: number;
  totalQuantity: number;
  totalValueSale: number;
  rrOrLrNum: string;
  vehicleNo: string;
  transport: string;
  driverName: string;
  driverContact: string;
  freightTotal: number;
  frightPaidAdvance: number;
  frightToPay: number;
  fromProfileInfoTxn: FromProfileInfoTxn;
  toProfileInfoTxn: ToProfileInfoTxn;
  

  // fromProfileApproval: FromProfileApproval;
  // managerApprovalGenerateDC: ManagerApprovalGenerateDC;
  // salesOfficerApprovalStatus: SalesOfficerApprovalStatus;
  // toProfileConfirmation: ToProfileConfirmation;
  // managerFinalApproval: ManagerFinalApproval;
}

export class ItemDetail {
  productId: any;
  productName: string;
  lotId: any;
  lotNumber: string;
  crop: string;
  packingQty: number;
  packingUnit: string;
  packetMRPPrice: number;
  numberOfPacketsOrdered: number;
  itemQuantityInKgs: number;
  effectiveRatePerKgForSale: number;
  packetInvoicePriceForSale: number;
  itemAmountForSale: number;
}


export class CreateReturnOrderDto {
  orderFromProfileId: any;
  orderFromProfileName: string;
  orderFromProfileRole: string;
  orderToProfileId: any;
  orderToProfileName: string;
  orderToProfileRole: string;
  orderDate: Date;
  items: ItemDetailReturn[];
  totalUnits: number;
  totalQuantity: number;
  totalValueReturn: number;
  rrOrLrNum: string;
  vehicleNo: string;
  transport: string;
  driverName: string;
  driverContact: string;
  freightTotal: number;
  frightPaidAdvance: number;
  frightToPay: number;
  fromProfileInfoTxn: FromProfileInfoTxn;
  toProfileInfoTxn: ToProfileInfoTxn;
 }

export class ItemDetailReturn {
  productId: any;
  productName: string;
  lotId: any;
  lotNumber: string;
  crop: string;
  packingQty: number;
  packingUnit: string;
  packetMRPPrice: number;
  numberOfPacketsOrdered: number;
  itemQuantityInKgs: number;
  effectiveRatePerKgForReturn: number;
  packetInvoicePriceForReturn: number;
  itemAmountForReturn: number;
}






// ledgers dto's













export enum FromProfileApproval {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECT = "REJECT"
}


export enum ManagerApprovalGenerateDC {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECT = "REJECT"
}

export enum SalesOfficerApprovalStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  APPROVED = 'APPROVED',
}


export enum ToProfileConfirmation {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  REJECT = "REJECT"
}


export enum ManagerFinalApproval {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECT = "REJECT"
}

export enum TypeOfSale {
  COMPANY_SALE = 'COMPANY_SALE',
  IPT = 'IPT',
  SALES_RETURN = 'SALES_RETURN',
}

export class FromProfileInfoTxn {
  gstin: string;
  email: string;
  phoneNo: string;
  completeAddress: string;
  address1: string;
  city: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
}

export class ToProfileInfoTxn {
  gstin: string;
  email: string;
  phoneNo: string;
  completeAddress: string;
  address1: string;
  city: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
}



export enum IOrderMessage {
    createdSuccess = 'Order Generated Successfully',
    updateSuccess = 'Order Update Successfully',
    deleteSuccess = 'Order deleted Successfully',
    foundSuccess = 'Orders fetched Successfully',
    notFound = 'Order Not Found',
    ledgerSessionFailed = 'Invoice Generation Failed',
    ledgerSessionSuccess = 'Invoice Generation Successful',
    dcSessionFailed = 'Delivery Challan Generation Failed',
    dcSessionSuccess = 'Delivery Challan Generation Successful',
    failedUnauthorisedAccessCreate = "Unauthorised Access, Order Creation failed",
    failedUnauthorisedAccessUpdate = "Unauthorised Access, Order Updation failed",
    failedUnauthorisedAccessDelete = "Unauthorised Access, Order deletion failed",
    failedUnauthorisedAccessFind = "Unauthorised Access, Order access failed",
    freightValidation = "freightValidation",
    dateError = "Please enter From and To date correctly",
    someError = "Please contact Company!!"
}


export enum ILastPriceFetchMessage {
  priceIsDifferent = "Price is different in the Sales Orders for the current Lot, Please contact admin for process",
  priceFetchedSuccessfully = "Last sales price for the current lot fetched successfully"
}


export enum IOrderValidationMessage {
  freightValidation = 'Freight Advance paid should be lesser than Freight Total',
  fromToProfileError = 'From and To Profile cannot be same',
}




export class IOrderfindOneByIdRes extends IModuleRes {
  data: ORDER;
}


export class IOrderfindManyRes extends IModuleRes {
  data: ORDER[];
  totalCount: number;
}


export interface OrderDelivaryChallanDetails {
    delivaryChallanId: string;
    delivaryChallanDate: Date;
    delivaryChallanNumber: string;
}