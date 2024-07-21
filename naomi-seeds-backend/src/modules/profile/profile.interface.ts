import { Document } from 'mongoose';
import { Role } from '../roles/roles.enum';
import { ProfileRole } from './profile-role.enum';

export interface Profile extends Document {
    // map(arg0: (data: any) => import("../ipt/ipt.dto").FromDistributorInfoTxn): import("../ipt/ipt.dto").FromDistributorInfoTxn;
    readonly _id?: any;
    readonly companyName: string;
    readonly profileRole: ProfileRole;
    readonly joinDate?: Date;
    readonly zone?: string;
    readonly firstLevelReportingUserID?: any;
    readonly firstLevelReportingUserName?: any;
    readonly secondLevelReportingUserID?: any;
    readonly secondLevelReportingUserName?: any;
    readonly thirdLevelReportingUserID?: any;
    readonly thirdLevelReportingUserName?: any; 
    readonly gstin?: string;
    readonly location?: Location;
    readonly addressDetails?: AddressDetails;
    readonly completeAddress?: string;
    readonly accountingInfo?: AccountingInfo;
    readonly status: boolean;
    readonly createdAt: Date;


//remove the below ones
    readonly roles?: any;
    readonly profileReportsToName?: any;
    readonly profileReportsToId?: any;
    readonly userTypeInternalOrExternal?: any;
    readonly roleGroupRefId?: any;
    // readonly userId?: any;
}

export interface AddressDetails {
    readonly address1: string;
    readonly city: string;
    readonly taluka: string;
    readonly district: string;
    readonly state: string;
    readonly pincode: string;
}

export interface AccountingInfo {
    readonly accountNumber?: string;
    readonly accountName?: string;
    readonly openingAccountStatementAmount: number;
    readonly openingAccountStatementAmountCrDr: number;
    readonly openingAccountStatementDate: Date;
}

export interface Location {
    readonly type: string;
    readonly coordinates: number[];
}

export interface AccountDetails {
    readonly accountNumber: string;
    readonly AccountName: string;
}




export enum IProfileMessage {
  createdSuccess = "Profile Details Created Successfully",
  updateSuccess = "Profile Details Details Update Successfully",
  deleteSuccess = "Profile Details Details Deleted Successfully",
  foundSuccess = "Profile Details Found Successully",
  notFound = "Profile Details Not Found",
  failedUnauthorisedAccessFind = "failedUnauthorisedAccessFind"
}