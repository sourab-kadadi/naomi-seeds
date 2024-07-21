import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus, NotFoundException, MethodNotAllowedException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IModuleRes } from '../../common.service';
import { CreatePaymentDto, PaymentfindOneByIdRes, IPaymentfindManyRes, IPaymentMessage, UpdatePaymentDto, UpdatePaymentAccountantDto, APPROVALSTATUS } from './payment.dto';
import { Payment } from './payment.interface';
import { LedgerService } from '../ledger/ledger.service';
import { ProfileService } from '../profile/profile.service';
import { Role } from '../roles/roles.enum';
import { ACCOUNTINGTYPE, createLedgerStatementDto, PARTICULARTYPE } from '../ledger/ledger.dto';
import { ProfilefindOneByIdRes } from '../profile/profile.dto';
@Injectable()

export class PaymentService {
  constructor(@InjectModel('payments') private readonly Module: Model<Payment>,
    private ledgerService: LedgerService,
    private profileService: ProfileService) { }

  async createModulePayment(paymentDto: CreatePaymentDto): Promise<IModuleRes> {
    try {
      const createPayment = new this.Module(paymentDto);
      await createPayment.save();
      return { status: true, message: IPaymentMessage.createdSuccess }
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + ' Already Exist',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

  async updateModule(_id: string, paymentDto: UpdatePaymentDto): Promise<IModuleRes> {
    try {
      let result = await this.Module.updateOne({ _id: _id }, { $set: paymentDto });
      return { status: true, message: IPaymentMessage.updateSuccess }
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + ' Already Exist',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

  // async updateModuleForAccountant(_id: string, PaymentDto: UpdatePaymentAccountantDto): Promise<IModuleRes> {
  //   const ledgerSession = await this.ledgerService.Module.db.startSession();
  //   ledgerSession.startTransaction();
  //   try {
  //     const getcompanyInfo = await this.profileService.findCompanyModule(Role.COMPANY);
  //     let getPaymentInfo = await this.Module.findOne({ _id: _id, approvalStatus: APPROVALSTATUS.PENDING });
  //     const ledgerDebitData = await this.generateLedgerDebitObj(PaymentDto, getPaymentInfo, getcompanyInfo);
  //     const ledgerCreditData = await this.generateLedgerCreditObj(PaymentDto, getPaymentInfo, getcompanyInfo);
  //     console.log(ledgerCreditData, 'ledgerCreditData, ')
  //     let ledgerDebitRes = await this.ledgerService.createModule(ledgerDebitData, ledgerSession);
  //     let ledgerCreditRes = await this.ledgerService.createModule(ledgerCreditData, ledgerSession);

  //     let result = await this.Module.updateOne({ _id: _id, approvalStatus: APPROVALSTATUS.PENDING },
  //       {
  //         $set: {
  //           approvalStatus: APPROVALSTATUS.RECEIVED,
  //           accountantId: PaymentDto.accountantId,
  //           accountantName: PaymentDto.accountantName,
  //           amount: PaymentDto.amount,
  //           accountantNote: PaymentDto.accountantNote,
  //           paymentReceivedDate: PaymentDto.paymentReceivedDate,
  //           image: PaymentDto.image,
  //           approvalStatusUpdatedByUserId: PaymentDto.accountantId,
  //           approvalStatusUpdatedByUserName: PaymentDto.accountantName,
  //           ledgerCreditId: ledgerCreditRes.data._id,
  //           ledgerDebitId: ledgerDebitRes.data._id
  //         }
  //       });
  //     if (result) {
  //       await ledgerSession.commitTransaction();
  //       return { status: true, message: IPaymentMessage.updateSuccess }
  //     } else {
  //       ledgerSession.abortTransaction();
  //       return { status: false, message: IPaymentMessage.updateUnSuccess }
  //     }
  //   } catch (error) {
  //     ledgerSession.abortTransaction();
  //     throw error;
  //   } finally {
  //     ledgerSession.endSession();
  //   }
  // }


  // async deleteModule(_id: string): Promise<IModuleRes> {
  //   try {
  //     await this.Module.deleteOne({ _id: _id });
  //     return { status: true, message: IPaymentMessage.deleteSuccess }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findOneModule(_id: string): Promise<PaymentfindOneByIdRes> {
  //   try {
  //     let result = await this.Module.findOne({ _id: _id });
  //     if (result) {
  //       return { status: true, message: IPaymentMessage.foundSuccess, data: result }
  //     } else {
  //       return { status: false, message: IPaymentMessage.notFound, data: null }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }



  // async findManyModule(
  //   page: number,
  //   count: number,
  //   filter?: string,
  //   // status?: boolean,
  //   dateFrom?: Date,
  //   dateTo?: Date,
  //   distributorId?: string,
  //   approvalStatus?: string,
  // ): Promise<IPaymentfindManyRes> {
  //   try {
  //     let match = {};
  //     if (distributorId) {
  //       match = { match, ...{ distributorId: distributorId } }
  //     }
  //     if (approvalStatus) {
  //       match = { ...match, ...{ approvalStatus: approvalStatus } }
  //     }
  //     if (dateFrom && dateTo) {
  //       if (new Date(dateFrom) <= new Date(dateTo)) {
  //         match = { ...match, ...{ paymentReceivedDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } } };
  //       } else {
  //         return {
  //           status: false,
  //           message: IPaymentMessage.dateError,
  //           data: null,
  //           totalCount: 0,
  //         };
  //       }
  //     }
  //     count = Number(count || 10);
  //     page = Number(page || 0);
  //     let totalCount: any = [{ $count: 'count' }];
  //     let item: any = [
  //       { $sort: { _id: 1 } },
  //       { $skip: page * count },
  //       { $limit: count },
  //     ]
  //     if (filter && filter != '') {
  //       let search = {
  //         $or: [{
  //           distributorName: { $regex: new RegExp(filter, "i") }
  //         },
  //         { categoryType: { $regex: new RegExp(filter, "i") } },
  //           // { dcUniqueNo: { $regex: new RegExp(filter, "i") } }
  //         ]
  //       };
  //       match = { ...match, ...search };
  //     }
  //     // if (status != undefined && status != null && typeof status === "boolean") {
  //     //   match = { ...match, ...{status: status}};
  //     // }
  //     if (match && match != {}) {
  //       item.unshift({ $match: match });
  //       totalCount.unshift({ $match: match });
  //     }
  //     let result = await this.Module.aggregate([
  //       {
  //         $facet: {
  //           item: item,
  //           totalCount: totalCount,
  //         },
  //       },
  //     ]);
  //     if (result && result[0].item.length > 0) {
  //       return {
  //         status: true,
  //         message: IPaymentMessage.foundSuccess,
  //         data: result[0].item,
  //         totalCount: result[0].totalCount[0].count,
  //       };
  //     } else {
  //       return {
  //         status: false,
  //         message: IPaymentMessage.notFound,
  //         data: null,
  //         totalCount: 0,
  //       };
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async rejectPayment(_id: string): Promise<PaymentfindOneByIdRes> {
  //   try {

  //     let result = await this.Module.updateOne({ _id: _id, approvalStatus: APPROVALSTATUS.PENDING }, { $set: { approvalStatus: APPROVALSTATUS.REJECTED } });
  //     if (result) {
  //       return { status: true, message: IPaymentMessage.foundSuccess, data: result }
  //     } else {
  //       return { status: false, message: IPaymentMessage.notFound, data: null }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }




  // // Ledeger modules
  // async generateLedgerDebitObj(PaymentDto: UpdatePaymentAccountantDto, getPaymentInfo: { distributorId: any; distributorName: any; _id: any; }, getcompanyInfo: ProfilefindOneByIdRes): Promise<any> {
  //   let ledger: createLedgerStatementDto = {
  //     partyProfileId: getcompanyInfo.data[0]._id,
  //     partyName: getcompanyInfo.data[0].companyName,
  //     oppositePartyProfileId: getPaymentInfo.distributorId,
  //     oppositePartyName: getPaymentInfo.distributorName,
  //     txnRefId: getPaymentInfo._id,
  //     txnRefCollection: "Payment",
  //     txnDate: PaymentDto.paymentReceivedDate,
  //     accountingType: ACCOUNTINGTYPE.DR,
  //     particularType: PARTICULARTYPE.PAYMENT_RECEIVED,
  //     amount: PaymentDto.amount,
  //     narration: `Payment Received from ${getPaymentInfo.distributorName}`
  //   };
  //   return ledger;
  // }

  // async generateLedgerCreditObj(PaymentDto: UpdatePaymentAccountantDto, getPaymentInfo: { distributorId: any; distributorName: any; _id: any; }, getcompanyInfo: ProfilefindOneByIdRes): Promise<any> {

  //   let ledger: createLedgerStatementDto = {
  //     partyProfileId: getPaymentInfo.distributorId,
  //     partyName: getPaymentInfo.distributorName,
  //     oppositePartyProfileId: getcompanyInfo.data[0]._id,
  //     oppositePartyName: getcompanyInfo.data[0].companyName,
  //     txnRefId: getPaymentInfo._id,
  //     txnRefCollection: "Payment",
  //     txnDate: PaymentDto.paymentReceivedDate,
  //     accountingType: ACCOUNTINGTYPE.CR,
  //     particularType: PARTICULARTYPE.PAYMENT_MADE,
  //     amount: PaymentDto.amount,
  //     narration: `Payment made to NSLLP`
  //   };
  //   return ledger;
  // }












}
