import { Injectable } from '@nestjs/common';
import { PdfServiceService } from './modules/pdf-service/pdf-service.service';

import { ToWords } from 'to-words';
import { MailsService } from './modules/mails/mails.service';
import * as puppeteer from 'puppeteer-core';

@Injectable()
export class AppService {
  constructor(private readonly pdfService: PdfServiceService,
    private readonly mailsService: MailsService){}

  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    }
  });

  tempInvoice = {
    // "_id" : ObjectId("62a1d8f5e68b6406630b782b"),
    // "iptId" : ObjectId("62a1d7d7e68b6406630b7822"),
    "uniqueNumber" : "NS-CN-791",
    "fromDistributorName" : "Naomi Seeds Private Limited",
    // "toDistributorId" : ObjectId("62a1d0f7f604b40370538bca"),
    "toDistributorName" : "Naomi Seeds Pvt Ltd",
    // "salesPersonId" : ObjectId("6238cbe4ce3f7804dcaa9d22"),
    "salesPersonName" : "sourab kadadi",
    // "salesOrderDate" : ISODate("2022-06-09T00:00:00.000Z"),
    "type" : "CREDIT_NOTE",
    "items" : [ 
        {
            "unit" : "Kgs",
            // "_id" : ObjectId("62a1d8f5e68b6406630b782c"),
            "productName" : "Naomi - 1000 M",
            "lotNumber" : "N01221M12",
            "crop" : "Maize",
            "hnsNumber" : "10051018",
            "quantity" : 400,
            "packingSizeinKg" : 4,
            "numberOfPacketsOrdered" : 100,
            "rate" : 335,
            "amount" : 134000,
            "productDetails" : {
                "cropType" : "Field Crops",
                "morphologicalCharacters" : [],
                "specialFeaturesUSPS" : []
            },
            "lotDetails" : {
                "processingPlantNo" : "Sy. No. 59",
                "totalQtyOfLotsInKgs" : 11280,
                "numberOfPackets" : 2820,
                "dateOfTest" : "2022-05-11T00:00:00.000Z",
                "lableNoFrom" : 26186,
                "labelNoTo" : 29160,
                "missingNo" : 50,
                "germinationInPercentage" : 97,
                "pureSeedInPercentage" : 98,
                "inertMatterNotMoreThanPercent" : 2,
                "otherCropSeedsNotMoreThanPerKg" : 10,
                "geneticPurityInPercentage" : 98,
                "dateOfPacking" : "2022-05-26T00:00:00.000Z",
                "validUpto" : "2023-02-10T00:00:00.000Z",
                "seedGrowerNameAndAddress" : "ARK - Eluru District",
                "seedPurchasedFrom" : "ARK",
                "maleSeedUsed" : "NS101",
                "femaleSeedUsed" : "NS102",
                "sowingSeason" : "Kharif Season",
                "seedProductionSupervisor" : "PSN Rao",
                "seedProcessingSupervisor" : "Vijay Mishra"
            }
        }, 
        {
            "unit" : "Kgs",
            // "_id" : ObjectId("62a1d8f5e68b6406630b782d"),
            "productName" : "Naomi - 540",
            "lotNumber" : "256365",
            "crop" : "maize",
            "hnsNumber" : "10051018",
            "quantity" : 200,
            "packingSizeinKg" : 20,
            "numberOfPacketsOrdered" : 10,
            "rate" : 500,
            "amount" : 100000,
            "productDetails" : {
                "cropType" : "Field Crops",
                "morphologicalCharacters" : [],
                "specialFeaturesUSPS" : []
            },
            "lotDetails" : {
                "processingPlantNo" : "Sy. No. 59",
                "totalQtyOfLotsInKgs" : 25,
                "numberOfPackets" : 3600,
                "dateOfTest" : "2022-06-03T00:00:00.000Z",
                "lableNoFrom" : 12,
                "labelNoTo" : 69,
                "missingNo" : 50,
                "germinationInPercentage" : 90,
                "pureSeedInPercentage" : 90,
                "inertMatterNotMoreThanPercent" : 90,
                "otherCropSeedsNotMoreThanPerKg" : 90,
                "geneticPurityInPercentage" : 90,
                "dateOfPacking" : "2022-06-03T00:00:00.000Z",
                "validUpto" : "2026-08-07T00:00:00.000Z",
                "seedGrowerNameAndAddress" : "random",
                "seedPurchasedFrom" : "random",
                "maleSeedUsed" : "NS5625",
                "femaleSeedUsed" : "NS696",
                "sowingSeason" : "Kharif Season",
                "seedProductionSupervisor" : "Vijay",
                "seedProcessingSupervisor" : "Vijay"
            }
        }
    ],
    "totalUnits" : 1,
    "totalQuantity" : 600,
    "totalValue" : 234000,
    // "createdAt" : ISODate("2022-06-09T11:26:45.399Z"),
    // "updatedAt" : ISODate("2022-06-09T11:26:45.399Z"),
    // "__v" : 0
}

 async onApplicationBootstrap(){
    console.log('application booststraped');


    // const data = await this.pdfService.generatePDFToS3('123','samp1231-server.pdf',{
      // locals: {
    //     // salesOrderNumber: this.tempSalesOrder.salesOrderNumber,
    //     // amountInWords: this.toWords.convert(this.tempInvoice.totalValue),
    //     // amountInWords: 123,
    //     // creditNote: this.tempInvoice
        
    //     // totalValue: "20000",
      // }
    // });
    // console.log({data})
    // // console.log(this.toWords.convert(this.tempInvoice.totalValue));
  
    // (async () => {
    //   const executablePath = await puppeteer.executablePath();
    //   console.log('Executable path:', executablePath);
    // })();


    // (async () => {
    //   const executablePath = '/usr/bin/google-chrome'; // Replace this with the correct executable path in your Gitpod environment
    //   const browser = await puppeteer.launch({ headless: true, executablePath });
    //   console.log('Executable path:', executablePath);
    //   // Your Puppeteer code here...
    //   await browser.close();
    // })();
  
  }


// emailDCDto = {
//   email: 'sourabyk@gmail.com',
//   firstName: 'sourab',
//   lastName: 'Kadadi',
//   fileName: 'https://naomiseeds.s3.ap-south-1.amazonaws.com/14b6876321d570e47510447e87a02538NS-DC-12580.pdf',
// }
//  async onApplicationBootstrap(){
//     console.log('application bootstraped');
//     const data = await this.mailsService.sendDeliveryChallan(this.emailDCDto);
//     console.log({data})
//   }


// num = 1111224;
//  async onApplicationBootstrap(){
//     console.log(this.num.toLocaleString("en-IN"));
//   }



  getHello(): string {
    let x = 10;
    return 'Hello World!';
  }
}

