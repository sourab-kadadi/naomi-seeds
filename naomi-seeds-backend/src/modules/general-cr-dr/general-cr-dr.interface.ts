import { Document } from 'mongoose';

export interface GeneralCrDr extends Document {
  readonly genCrDrNumber: string;
  readonly fromDistributorId: any;
  readonly fromDistributorName: any;
  readonly fromDistributorRole: any;
  readonly toDistributorId: any;
  readonly toDistributorName: any;
  readonly accountantId: any;
  readonly accountantName: any; 
  readonly adminId: any;
  readonly adminName: any; 
  readonly salesPersonId: any;
  readonly salesPersonName: any;
  readonly managerId: any;
  readonly managerName: any;
  readonly genCrDrDate: Date;
  readonly items: ItemDetail[];
  readonly totalValue: number;
  readonly discountsPdfFileName: string;
  readonly debitsPdfFileName: string;
  readonly narration: string;
  readonly ledgerCreditId: string;
  readonly ledgerDebitId: string;
  readonly typeOfEntry: string;
  readonly transactionApproval : string;
  readonly createdAt: Date;
}


export interface ItemDetail {
  readonly productId:  any;
  readonly productName:  string;
  readonly crop:  string;
  readonly hnsNumber: string;
  readonly quantity:  number;
  readonly rateDiff: number;
  readonly amount:  number;
}


