import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { otp } from './otp.schema';
import { MailsModule } from '../mails/mails.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'OTP', schema: otp }]),
    MailsModule,
   ],
    providers: [OtpService],
    exports: [OtpService]
  })
  export class OtpModule {}
    