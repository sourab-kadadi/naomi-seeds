import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { IModuleRes } from "src/common.service";
import { ProfileDto } from "../profile/profile.dto";
import { Role } from "../roles/roles.enum";
import { User } from "./user.interface";

export class UserDto {
    @IsNotEmpty({ message: "First Name Should Not Be Empty!" })
    firstName: string;
    @IsNotEmpty({ message: "Last Name Should Not Be Empty!" })
    lastName: string;
    // @IsNotEmpty({message: "Password Should Not Be Empty!"})
    // psw: string;
    @IsEmail()
    email: string;
    @IsNotEmpty({ message: "Phone Number Should Not Be Empty!" })
    phoneNo: number;
    birthDay?: Date;
    roles: any;
    roleGroupRefId: any;
    permissionsData: permissionsData;
    userTypeInternalOrExternal: string;
    userLinkToProfileId: any;
    userLinkToProfileCompanyName: any;
    userJoiningDate?: Date;
    zone?: any
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

export class UpdateUserDto {
    @IsNotEmpty({ message: "First Name Should Not Be Empty!" })
    firstName: string;
    @IsNotEmpty({ message: "Last Name Should Not Be Empty!" })
    lastName: string;
    // @IsNotEmpty({message: "Password Should Not Be Empty!"})
    // psw: string;
    @IsEmail()
    email: string;
    @IsNotEmpty({ message: "Phone Number Should Not Be Empty!" })
    phoneNo: number;
    birthDay?: Date;
    roles: any;
    roleGroupRefId: any;
    permissionsData: permissionsData;
    userTypeInternalOrExternal: string;
    userLinkToProfileId: any;
    userLinkToProfileCompanyName: any;
    userJoiningDate: Date;
    zone?: any
}





export class LoginDto {
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly psw: string;
}

export interface ILoginqRes {
    accessToken: ITokenRes;
    refreshToken: ITokenRes;
}

export interface ITokenRes {
    cookies: string;
    token: string;
}

export interface ILoginTokenPayload extends ILoginqRes {
    payload: ILoginPayload;
}

export interface ILoginPayload {
    firstName: string;
    lastName: string;
    email: string;
    roles: Role;
    phoneNo: string;
    userId: string;
    // profileId: string;
    iat: number;
}

export class IRenewRefreshToken {
    refreshToken: string;
}

export class EmailDto {
    @IsEmail()
    readonly email: string;
}

export class EmailOtpDto {
    @IsEmail()
    readonly email: string;
    readonly userId: any;
    readonly firstName: string;
    readonly lastName: string;
}



export enum IUserMessage {
    createdSuccess = 'User Created Successfully',
    updateSuccess = 'User Details Update Successfully',
    deleteSuccess = 'User Deleted Successfully',
    foundSuccess = 'User Found Successully',
    notFound = 'User Not Found',
    passwordResetSuccess = "Password has been reset successfully",
    passwordResetFailed = "Password reset failed !!",
    otpSentSuccess = "OTP sent successfully"
}

export class UserfindOneByIdRes extends IModuleRes {
    data: User;
  }

  export class UserfindManyByRoleRes extends IModuleRes {
    data: User[];
  }
  
  export class UserfindManyRes extends IModuleRes {
    data: User[];
    totalCount: number;
  }