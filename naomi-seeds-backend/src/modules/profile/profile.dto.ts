import { IsNotEmpty, ArrayMinSize, ArrayMaxSize, ValidateIf } from 'class-validator';
import { IModuleRes } from '../../common.service';
import { Role } from '../roles/roles.enum';
import { ProfileRole } from './profile-role.enum';
import { Profile } from './profile.interface';


export class AddressDetails {
  address1: string;
  city: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
}

export class Location {
  type: string;
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  coordinates: number[];
}

export class AccountingInfo {
   accountNumber?: string;
   accountName?: string;
   openingAccountStatementAmount: number;
   openingAccountStatementAmountCrDr: number;
   openingAccountStatementDate: Date;
}

export class ProfileDto {
  companyName: string;
  profileRole: ProfileRole;
  joinDate?: string;
  zone?: string;
  firstLevelReportingUserID?: any;
  firstLevelReportingUserName?: any;
  secondLevelReportingUserID?: any;
  secondLevelReportingUserName?: any;
  thirdLevelReportingUserID?: any;
  thirdLevelReportingUserName?: any; 
  gstin?: string;
  location?: Location | [];
  addressDetails: AddressDetails;
  completeAddress: string;
  accountingInfo?: AccountingInfo;

  // @ValidateIf(o => o.roles.includes(Role.DISTRIBUTOR))
//remove the below ones
userTypeInternalOrExternal? : any;
permissionsData: any;
roleGroupRefId: any;

}








export class ProfileUpdateDto extends  ProfileDto {
  joinDate?: string;
  // @ValidateIf(o => o.roles.includes(Role.DISTRIBUTOR))
  areasCovered: string;
  firstLevelReportingUserID?: any;
  firstLevelReportingUserName?: any;
  secondLevelReportingUserID?: any;
  secondLevelReportingUserName?: any;
  thirdLevelReportingUserID?: any;
  thirdLevelReportingUserName?: any; 
  gstin?: string;
  location?: Location | [];
  addressDetails: AddressDetails;
  completeAddress: string;
  accountingInfo?: AccountingInfo;

}

export class ProfilefindOneByIdRes extends IModuleRes {
  data: Profile;
}

export class ProfilefindManyByRoleRes extends IModuleRes {
  data: Profile[];
}

export class ProfilefindManyRes extends IModuleRes {
  data: Profile[];
  totalCount: number;
}

export enum IProfileMessage {
  createdSuccess = "Profile Created Successfully",
  updateSuccess = "Profile Details Update Successfully",
  deleteSuccess = "Profile Details Deleted Successfully",
  foundSuccess = "Profile Found Successully",
  notFound = "Profile Not Found",
  failedUnauthorisedAccessCreate = "Unauthorised Access, Profile Creation failed",
  failedUnauthorisedAccessUpdate = "Unauthorised Access, Profile Updation failed",
  failedUnauthorisedAccessDelete = "Unauthorised Access, Profile deletion failed",
  failedUnauthorisedAccessFind = "Unauthorised Access, Profile access failed",
}