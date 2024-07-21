import { HttpCode, Injectable, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
// import { StoreModule } from './modules/store/store.module';
import { CatalogModule } from './modules/catalog/catalog.module';
// import { CategoryModule } from './modules/category/category.module';
// import { StoreRegistrationModule } from './modules/StoreRegistration/storeRegistration.module';
// import { GiverPostModule } from './modules/giver-post/giver-post.module';
// import { GiverDetailsModule } from './modules/giver-details/giver-details.module';
// import { JobPostModule } from './modules/job-post/job-post.module';
import { UtilsService } from './service/utils/utils.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './modules/aws/aws.module';
import { ProfileModule } from './modules/profile/profile.module';
// import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import configuration from './config/configeration';
import { RedisModule } from './modules/redis/redis.module';
// import { ServiceDataModule } from './modules/service-data/service-data.module';
// import { CandidateProfileModule } from './modules/candidate-profile/candidate-profile.module';
// import { JobApplyModule } from './modules/job-apply/job-apply.module';
// import { HealthCheckController } from './modules/health-check/health-check.controller';
// import { FinCompanyModule } from './modules/fin-company/fin-company.module';
// import { PaymentModule } from './modules/payment/payment.module';
// import { IptModule } from './modules/ipt/ipt.module';
import { MailsService } from './modules/mails/mails.service';
import { MailsModule } from './modules/mails/mails.module';
import { OtpService } from './modules/otp/otp.service';
import { OtpModule } from './modules/otp/otp.module';
import { PdfServiceService } from './modules/pdf-service/pdf-service.service';
import { PdfServiceModule } from './modules/pdf-service/pdf-service.module';
import { AwsService } from './modules/aws/aws.service';
import { LotDataModule } from './modules/lot-data/lot-data.module';
import { LedgerService } from './modules/ledger/ledger.service';
import { LedgerModule } from './modules/ledger/ledger.module';
import { RequirementModule } from './modules/requirement/requirement.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/roles/roles.guard';
import { DropDownsModule } from './modules/drop-downs/drop-downs.module';
import { GeneralCrDrModule } from './modules/general-cr-dr/general-cr-dr.module';
import { RolesPermissionsModule } from './modules/roles-permissions/roles-permissions.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductPackingSizesModule } from './modules/product-packing-sizes/product-packing-sizes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';



// @Injectable() // Decorate the service with @Injectable()
// export class MyProvider {
//   constructor(private readonly UtilsService: UtilsService) {}

//   public myMethod() {
//     // do something
//   }
// }

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   // 'mongodb+srv://dataaccess:ypiy5cGE28z88B3y@iknowjobsdb.a6cww.mongodb.net/NAOMI?retryWrites=true', //testing
    //   'mongodb+srv://naomiseeds:ycRKlU3qaki98Qvq@naomiprod1.phtdm.mongodb.net/NAOMI_PRODUCTION?retryWrites=true',  //production

    //   // 'mongodb+srv://naomiseeds:ycRKlU3qaki98Qvq@naomiprod1.phtdm.mongodb.net/?retryWrites=true',     //data catalog entry current
    //   /// 'mongodb+srv://naomiseeds:ycRKlU3qaki98Qvq@naomiprod1.phtdm.mongodb.net/?retryWrites=true&w=majority', 

    //   { useNewUrlParser: true, poolSize: 10 }
    // ),

    MongooseModule.forRootAsync({
      useFactory: () => ({
        // uri: 'mongodb+srv://dataaccess:ypiy5cGE28z88B3y@iknowjobsdb.a6cww.mongodb.net/NAOMI?retryWrites=true', //testing  
        // uri: 'mongodb+srv://naomiseeds:ycRKlU3qaki98Qvq@naomiprod1.phtdm.mongodb.net/NAOMI_FINAL_PRODUCTION?retryWrites=true', //prod
        uri: 'mongodb+srv://naomiseeds:ycRKlU3qaki98Qvq@naomiprod1.phtdm.mongodb.net/NAOMI_PRODUCTION?retryWrites=true', //testing and working
        useNewUrlParser: true,
        // poolSize: 10,
      }),
    }),
    



    UserModule,    //contains link to current user modules 
    // StoreModule,

    // StoreRegistrationModule,
    // GiverPostModule,
    // GiverDetailsModule,
    // SubCategoryModule,
    // JobApplyModule,
    // FinCompanyModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, envFilePath: ['.env.dev'] }),
    AwsModule,
    RedisModule,
    // ServiceDataModule,
    // CategoryModule,
    // HttpCode,



    CatalogModule,
    ProfileModule,
    
    // PaymentModule,
    // IptModule,
    MailsModule,
    OtpModule,
    PdfServiceModule,
    LotDataModule,
    LedgerModule,
    RequirementModule,
    DropDownsModule,
    GeneralCrDrModule,
    RolesPermissionsModule,
    ProductCategoryModule,
    ProductPackingSizesModule,
    OrdersModule,
    PaymentModule,


  ],
  controllers: [AppController, 
    // HealthCheckController
  ],
  providers: [
    // MyProvider
    AppService, 
    MailsService, PdfServiceService, AwsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
  // exports: [MyProvider]
})
export class AppModule { }
