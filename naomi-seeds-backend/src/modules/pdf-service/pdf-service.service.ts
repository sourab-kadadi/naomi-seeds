import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import * as puppeteer from 'puppeteer-core';
import * as ejs from 'ejs';

@Injectable()
export class PdfServiceService {
  constructor(
    private readonly awsService: AwsService,
  ) {}

  async generatePDFToBuffer(template,pdfOptions): Promise<Buffer> {
    // If using Handlebars templating
    const html = await ejs.renderFile(template, pdfOptions && pdfOptions.locals || {});
    
    // If you have a static HTML string instead of using Handlebars
    // const html = '<html><body><h1>' + data.title + '</h1><p>' + data.content + '</p></body></html>';

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });



    const page = await browser.newPage();
    await page.setContent(html);

    // Adjust the 'pdfOptions' object according to your preferences (e.g., format, margin, etc.)
    const options = {
      format: 'A4',
      margin: {
        top: '20px',
        bottom: '40px',
        left: '20px',
        right: '20px',
      },
      ...pdfOptions
    };

    const pdfBuffer = await page.pdf(options as puppeteer.PDFOptions);

    await browser.close();

    return pdfBuffer;
  }

  generatePDFToS3(template: string, filename: string, pdfOptions: puppeteer.PDFOptions & { locals: any }) {
    const inst = this;
    return new Promise<string>((resolve, reject) => {
      this.generatePDFToBuffer(`templates/${template}/html.ejs`, pdfOptions)
        .then(async (pdfBuffer: Buffer) => {
          const fileData = await inst.awsService.uploadS3WithStream({stream: pdfBuffer,filename,contentType: 'application/pdf'});

          // console.log({fileData})
          resolve(fileData);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  // generatePDFToS3(template: string, filename: string, pdfOptions: PDFOptions) {
  //   const inst = this;
  //   return new Promise((resolve, reject) => {
  //     this.generatePDFToStream(template, pdfOptions).subscribe({
  //       async next(stream) {
  //         // console.log('streaming',this)
  //         const fileData = await inst.awsService.uploadS3WithStream({
  //           stream,
  //           filename,
  //           contentType: 'application/pdf',
  //         });
  //         // console.log({fileData})
  //         resolve(fileData);
  //       },
  //       error(err) {
  //         reject(err);
  //       },
  //     });
  //   });
  // }

}
