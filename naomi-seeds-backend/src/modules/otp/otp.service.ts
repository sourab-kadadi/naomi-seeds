import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from './otp.interface';
import { IOtpMessage, ResetPasswordDto, VerifyOtpRes } from './otp.dto';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import { MailsService } from '../mails/mails.service';
import {EmailOtpDto} from '../users/user.dto';

@Injectable()
export class OtpService {
    
    constructor(
        @InjectModel('OTP') private readonly Module: Model<OTP>,
        private mailsService: MailsService, ) {}

        async generateOtp(EmailOtpDto: EmailOtpDto):Promise<IModuleRes> {
            try {
              const otpMeta = "1234567890";
              let otp: string = "";
              for (let i=0; i<6; i++) {
                  otp += otpMeta.charAt(Math.floor(Math.random()*otpMeta.length));
              }
              let data = {
                userId: EmailOtpDto.userId,
                email: EmailOtpDto.email,
                otp: otp,
              }
            let emailData = {
                userId: EmailOtpDto.userId, 
                email: EmailOtpDto.email,
                firstName: EmailOtpDto.firstName,
                lastName: EmailOtpDto.lastName,
                otp: otp
            } 

            await this.Module.findOneAndUpdate({userId: EmailOtpDto.userId}, data, {upsert: true} );
            await this.mailsService.sendUserOtpMailForgotPassword(emailData);
              return {status: true, message: IOtpMessage.createdSuccess,};
            } catch (error) {
              if (error.code && error.code == 11000) {
                let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
                let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
                throw new HttpException(
                  DuplicateArrayToString + ' Already Exist',
                  HttpStatus.CONFLICT,
                );
              } else {
                 throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }
          }


          async verifyOtp (resetPasswordDto: ResetPasswordDto):Promise<IDataModuleRes<VerifyOtpRes>> {
              try {
                let verified = false;
                let result = await this.Module.findOne({email: resetPasswordDto.email, otp: resetPasswordDto.otp});
                if (result) {
                    verified = true;
                    return {status: true, message: IOtpMessage.verifiedSuccess, data: { verified, email: 'result.email', userId: result.userId }};
                  } else {
                    return {status: false, message: IOtpMessage.verificationFailed, data: null };
                  }

              } catch (error) {
                throw error;
              }
          }
}

    
