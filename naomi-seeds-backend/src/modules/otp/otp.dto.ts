import { IsEmail, IsNotEmpty } from "class-validator";

export class OtpDto {
    @IsNotEmpty()
    userId: string;
    email: string;
}


export enum IOtpMessage {
    createdSuccess = "OTP Created Successfully",
    updateSuccess = "OTP Details Update Successfully",
    deleteSuccess = "OTP Details Deleted Successfully",
    foundSuccess = "OTP Found Successully",
    notFound = "OTP Not Found",
    verifiedSuccess = "OTP Authenticated sucessfully",
    verificationFailed = "OTP Authenticated failed. Please type the correct OTP !!!"
}

export interface VerifyOtpRes {
    verified: Boolean;
    userId: string;
    email: string
}


export class LoingWithOtp {
    otp: string;
}

export class ResetPasswordDto {
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly otp: string;
    @IsNotEmpty()
    password: string;
}