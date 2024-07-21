import { String } from 'aws-sdk/clients/acm';
import { IsNotEmpty, ArrayMinSize, IsOptional } from 'class-validator';
import { IModuleRes } from '../../common.service';
import { Payment } from './payment.interface';

export class CreatePaymentDto {
  profileId: any;
  profileName: string;
  createdByPersonId: any;
  createdByPersonName: string;
    amount: number;
    categoryTypeId: string;
    categoryType: string;
    salesOfficerNote?: string;
    image?: Media;
    paymentDate: Date;
    createdAt: Date;
}

export class Media {
  filePath: string;
  type: string;
}

export class UpdatePaymentAccountantDto {
  accountantId: any;
  accountantName: string;
  amount: number;
  categoryTypeId: string;
  categoryType: string;
  accountantNote: string;
  paymentDate: Date;
  image?: Media;
}

export class UpdatePaymentDto {
    profileId: any;
   profileName: string;
    amount: number;
    categoryTypeId: string;
    categoryType: string;
    salesOfficerNote?: string;
    image?: Media;
    paymentDate: Date;
}


export enum APPROVALSTATUS {
  PENDING = 'PENDING', 
  RECEIVED = "RECEIVED",
  REJECTED = "REJECTED",
}



export class PaymentfindOneByIdRes extends IModuleRes {
  data: Payment;
}

export enum IPaymentMessage {
  createdSuccess = 'Payment Created Successfully',
  updateSuccess = 'Payment Details Update Successfully',
  updateUnSuccess = 'Payment Details Update Failed',
  deleteSuccess = 'Payment Details Deleted Successfully',
  foundSuccess = 'Payment Found Successully',
  notFound = 'Payment Details Not Found',
  failedUnauthorisedAccessCreate = "Unauthorised Access, Payment Data Creation failed",
  dateError = "Please select the From and To date correctly !!",
  // failedUnauthorisedAccessUpdate = "Unauthorised Access, Lot Data Updation failed",
  // failedUnauthorisedAccessDelete = "Unauthorised Access, Lot Data deletion failed",
  failedUnauthorisedAccessFind = "Unauthorised Access, Payment access failed",
}


export class IPaymentfindManyRes extends IModuleRes {
  data: CreatePaymentDto[];
  totalCount: number;
}
