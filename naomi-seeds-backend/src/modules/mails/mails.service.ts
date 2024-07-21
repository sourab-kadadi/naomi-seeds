import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImailConfig } from '../../config/configration.dto';
import { UserDto } from '../users/user.dto';
import { EmailDCDto, EmailForgotPasswordOtpDto } from './mails.dto';
var SibApiV3Sdk = require('sib-api-v3-sdk');
// var SibApiV3Sdk = require('sib-api-v3-typescript');


@Injectable()
export class MailsService {
    private mailConfig: ImailConfig;

    constructor(private configService: ConfigService) {
        this.mailConfig = this.configService.get<ImailConfig>('sendinblueCredential');
    }


    async sendUserSignupMail(UserDto: UserDto): Promise<any> {
        let defaultClient = SibApiV3Sdk.ApiClient.instance;

        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = this.mailConfig.apiKey;

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

        sendSmtpEmail = {
            to: [{
                email: UserDto.email,
                name: UserDto.firstName + ' ' + UserDto.lastName,
            }],
            templateId: 1,
            params: {
                FIRSTNAME: UserDto.firstName,
                LASTNAME: UserDto.lastName,
                MOBILENUMBER: UserDto.phoneNo,
                ROLE: 'UserDto.profile.roles'     //update this role 
            },
            headers: {
                'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
            }
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + data);
        }, function (error) {
            console.error(error);
        });
    }




    async sendUserOtpMailForgotPassword(EmailForgotPasswordOtpDto: EmailForgotPasswordOtpDto): Promise<any> {

        try {
            var defaultClient = SibApiV3Sdk.ApiClient.instance;

            var apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = this.mailConfig.apiKey;

            var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


            var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

            sendSmtpEmail = {
                to: [{
                    email: EmailForgotPasswordOtpDto.email,
                    name: EmailForgotPasswordOtpDto.firstName + ' ' + EmailForgotPasswordOtpDto.lastName,
                }],
                templateId: 5,
                params: {
                    FIRSTNAME: EmailForgotPasswordOtpDto.firstName,
                    LASTNAME: EmailForgotPasswordOtpDto.lastName,
                    OTP: EmailForgotPasswordOtpDto.otp
                    // MOBILENUMBER: EmailOtpDto.phoneNo,
                    // ROLE: EmailOtpDto.profile.roles
                },
                headers: {
                    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
                }
            };

            await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('API called successfully. Returned data: ' + data);
            }, function (error) {
                console.error(error);
            });
        } catch (error) {
            throw error
        }


    }




    async sendDeliveryChallan(emailDCDto: any): Promise<any> {
        try {
            console.log(emailDCDto)
            var defaultClient = SibApiV3Sdk.ApiClient.instance;
            var apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = this.mailConfig.apiKey;
            var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
            sendSmtpEmail = {
                to: [{
                    email: emailDCDto.email,
                    name: emailDCDto.firstName + ' ' + emailDCDto.lastName,
                }],
                templateId: 6,
                params: {
                    FIRSTNAME: emailDCDto.firstName,
                    // LASTNAME: EmailForgotPasswordOtpDto.lastName,
                    // OTP: EmailForgotPasswordOtpDto.otp
                    // MOBILENUMBER: EmailOtpDto.phoneNo,
                    // ROLE: EmailOtpDto.profile.roles

                },
                attachment: [
                    {
                      url: emailDCDto.fileName, // Should be publicly available and shouldn't be a local file
                      name: 'myAttachment.pdf'
                    }
                  ],
                headers: {
                    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
                }
            };

            await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('API called successfully. Returned data: ' + data);
            }, function (error) {
                console.error(error);
            });
        } catch (error) {
            throw error
        }


    }











}
