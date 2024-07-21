import { IsNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';
import { IModuleRes } from '../../common.service';
import { GeneralCrDr } from './general-cr-dr.interface';



export interface CreateDiscountProductDto extends Document {
  genCrDrNumber?: string;
  fromDistributorId?: any;
  fromDistributorName?: any;
  fromDistributorRole?: any;
  toDistributorId: any;
  toDistributorName: any;
  accountantId?: any;
  accountantName?: any; 
  adminId?: any;
  adminName?: any; 
  salesPersonId?: any;
  salesPersonName?: any;
  managerId?: any;
  managerName?: any;
  genCrDrDate: Date;
  items: ItemDetail[];
  totalValue: number;
  discountsPdfFileName?: string;
  debitsPdfFileName?: string;
  narration?: string;
  ledgerCreditId?: string;
  ledgerDebitId?: string;
  typeOfEntry?: string;
  transactionApproval?: string;
}

export interface generalCrDrLedgerDto extends Document {
  _id?: any;
  genCrDrNumber?: string;
  fromDistributorId?: any;
  fromDistributorName?: any;
  fromDistributorRole?: any;
  toDistributorId: any;
  toDistributorName: any;
  accountantId?: any;
  accountantName?: any; 
  adminId?: any;
  adminName?: any; 
  salesPersonId?: any;
  salesPersonName?: any;
  managerId?: any;
  managerName?: any;
  genCrDrDate: Date;
  items: ItemDetail[];
  totalValue: number;
  discountsPdfFileName?: string;
  debitsPdfFileName?: string;
  narration?: string;
  ledgerCreditId?: string;
  ledgerDebitId?: string;
  typeOfEntry?: string;
  transactionApproval?: string;
}


export interface GeneralCrDrDto extends Document {

  genCrDrNumber: string;
  fromDistributorId: any;
  fromDistributorName: any;
  fromDistributorRole: any;
  toDistributorId: any;
  toDistributorName: any;
  accountantId: any;
  accountantName: any; 
  adminId: any;
  adminName: any; 
  salesPersonId: any;
  salesPersonName: any;
  managerId: any;
  managerName: any;
  genCrDrDate: Date;
  items: ItemDetail[];
  totalValue: number;
  discountsPdfFileName: string;
  debitsPdfFileName: string;
  narration: string;
  ledgerCreditId: string;
  ledgerDebitId: string;
  typeOfEntry: string;
  createdAt: Date;
  transactionApproval: string;
}





export interface ItemDetail {
  productId:  any;
  productName:  string;
  crop:  string;
  hnsNumber: string;
  quantity:  number;
  rateDiff: number;
  amount:  number;
}







export enum typeOfEntry {
  DISCOUNTS_FOR_PRODUCT_PURCHASES = 'DISCOUNTS_FOR_PRODUCT_PURCHASES',
  EXPENSE_INCURRED_ON_BEHALF_OF_DISTRIBUTOR = 'EXPENSE_INCURRED_ON_BEHALF_OF_DISTRIBUTOR',
  TRANSPORTATION_EXPENSE_CR_TO_DISTRIBUTOR = 'TRANSPORTATION_EXPENSE_CR_TO_DISTRIBUTOR',
  GENERAL_DISCOUNT = 'GENERAL_DISCOUNT'

}


export enum transactionApproval {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED'

}









export class IGenCrDrfindOneByIdRes extends IModuleRes {
  data: GeneralCrDr;
}

export enum IGenCrDrMessage {
  createdSuccess = 'Discount Generated Successfully',
  updateSuccess = 'Discount Update Successfully',
  deleteSuccess = 'Discount Successfully',
  foundSuccess = 'Discount Successully',
  notFound = 'Discount Not Found',
  ledgerSessionFailed = 'Discount Generation Failed',
  ledgerSessionSuccess = 'Discount Generation Successful',
}


// export enum IIptValidationMessage {
//   freightValidation = 'Freight Advance paid should be lesser than Freight Total',
//   fromToDistributorError = 'From and To distributor cannot be same',
// }







export class IGenCrDrfindManyRes extends IModuleRes {
  data: CreateDiscountProductDto[];
  totalCount: number;
}


