import { Document } from 'mongoose';
import { FromProfileApproval, ManagerApprovalGenerateDC, ManagerFinalApproval, SalesOfficerApprovalStatus, ToProfileConfirmation } from './orders.dto';

export interface ORDER extends Document {
  readonly orderNumber: string;
  readonly orderFromProfileId: any;
  readonly orderFromProfileName: string;
  readonly orderFromProfileRole: string;
  readonly orderToProfileId: any;
  readonly orderToProfileName: string;
  readonly orderToProfileRole: string;
  readonly orderDate: Date;
  readonly orderType?: string;
  readonly items: ItemDetail[];
  readonly totalUnits: number;
  readonly totalQuantity: number;
  readonly totalValueReturn?: number;
  readonly totalValueSale?: number;
  readonly rrOrLrNum: string;
  readonly vehicleNo: string;
  readonly transport: string;
  readonly driverName: string;
  readonly driverContact: string;
  readonly freightTotal: number;
  readonly frightPaidAdvance: number;
  readonly frightToPay: number;
  readonly fromProfileInfoTxn: FromProfileInfoTxn;
  readonly toProfileInfoTxn: ToProfileInfoTxn;
  readonly fromProfileApproval: FromProfileApproval;
  readonly managerApprovalGenerateDC: ManagerApprovalGenerateDC;
  readonly salesOfficerApprovalStatus: SalesOfficerApprovalStatus;
  readonly toProfileConfirmation: ToProfileConfirmation;
  readonly managerFinalApproval: ManagerFinalApproval;
  readonly createdAt: Date;

  // readonly fromDistributorInfoTxn: FromDistributorInfoTxn;



  // readonly delivaryChallanId: any;
  // readonly dcPdfFileName: string;
  // readonly delivaryChallanNumber: string;

}

// export interface IPTtransaction extends Document {
//   readonly salesOrderNumber: string;
//   readonly fromDistributorId: any;
//   readonly fromDistributorName: any;
//   readonly toDistributorId: any;
//   readonly toDistributorName: any;
//   readonly salesPersonId: any;
//   readonly salesPersonName: any;
//   readonly salesOrderDate: Date;
//   readonly items: ItemDetail[];
//   readonly totalUnits: number;
//   readonly totalQuantity: number;
//   readonly totalValue: number;
//   readonly rrOrLrNum: string;
//   readonly vehicleNo: string;
//   readonly transport: string;
//   readonly freightTotal: number;
//   readonly frightPaidAdvance: number;
//   readonly frightToPay: number;
//   readonly fromDistributorApproval: FromDistributorApproval;
//   readonly managerApprovalGenerateDC: ManagerApprovalGenerateDC;
//   readonly salesOfficerApprovalStatus: SalesOfficerApprovalStatus;
//   readonly toDistributorConfirmation: ToDistributorConfirmation;
//   readonly managerFinalApproval: ManagerFinalApproval;
//   readonly createdAt: Date;
//   readonly _id: any;
//   readonly toDistributorInfoTxn: ToDistributorInfoTxn;
//   // readonly salesOrderNumber: string;
// }

// export interface IPTtransactionCN extends Document {
//   readonly salesOrderNumber: string;
//   readonly fromDistributorId: any;
//   readonly fromDistributorName: any;
//   readonly toDistributorId: any;
//   readonly toDistributorName: any;
//   readonly salesPersonId: any;
//   readonly salesPersonName: any;
//   readonly salesOrderDate: Date;
//   readonly items: ItemDetail[];
//   readonly totalUnits: number;
//   readonly totalQuantity: number;
//   readonly totalValue: number;
//   readonly rrOrLrNum: string;
//   readonly vehicleNo: string;
//   readonly transport: string;
//   readonly freightTotal: number;
//   readonly frightPaidAdvance: number;
//   readonly frightToPay: number;
//   readonly fromDistributorApproval: FromDistributorApproval;
//   readonly managerApprovalGenerateDC: ManagerApprovalGenerateDC;
//   readonly salesOfficerApprovalStatus: SalesOfficerApprovalStatus;
//   readonly toDistributorConfirmation: ToDistributorConfirmation;
//   readonly managerFinalApproval: ManagerFinalApproval;
//   readonly createdAt: Date;
//   readonly _id: any;
//   readonly fromDistributorInfoTxn: FromDistributorInfoTxn;
//   // readonly salesOrderNumber: string;
// }

export interface ItemDetail {
  readonly productId: any;
  readonly productName: string;
  readonly crop: string;
  readonly lotId: any;
  readonly lotNumber: string;
  readonly packingQty: number;
  readonly packingUnit: string;
  readonly packetMRPPrice: number;
  readonly numberOfPacketsOrdered: number;
  readonly itemQuantityInKgs?: number;
  readonly effectiveRatePerKgForSale?: number;
  readonly packetInvoicePriceForSale?: number;
  readonly effectiveRatePerKgForReturn?: number;
  readonly packetInvoicePriceForReturn?: number;
  readonly itemAmountForReturn?: number;
  readonly itemAmountForSale?: number;
}



export class FromProfileInfoTxn {
  readonly gstin: string;
  readonly email: string;
  readonly phoneNo: string;
  readonly address1: string;
  readonly address2: string;
  readonly city: string;
  readonly taluka: string;
  readonly district: string;
  readonly state: string;
  readonly pincode: string;
}

export class ToProfileInfoTxn {
  readonly gstin: string;
  readonly email: string;
  readonly phoneNo: string;
  readonly address1: string;
  readonly address2: string;
  readonly city: string;
  readonly taluka: string;
  readonly district: string;
  readonly state: string;
  readonly pincode: string;
}
