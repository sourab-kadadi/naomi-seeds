import { IsEmail, IsNotEmpty, Length } from "class-validator";


export class EmailForgotPasswordOtpDto {
    @IsEmail()
    readonly email: string;
    readonly userId: any;
    readonly firstName: string;
    readonly lastName: string;
    readonly otp: string;
}


export class EmailDCDto {
    @IsEmail()
    readonly email: string;
    // readonly userId: any;
    readonly firstName: string;
    readonly lastName: string;
    readonly fileName: string;
}


