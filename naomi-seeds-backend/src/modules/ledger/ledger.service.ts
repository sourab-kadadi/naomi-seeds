import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
// import { ApprovalStatus, IPT } from './ipt.interface';
// import { FromDistributorApproval, IPT, ManagerApprovalGenerateDC, SalesOfficerApprovalStatus, ToDistributorConfirmation, ManagerFinalApproval, IPTtransaction } from './ipt.interface';
// import { CreateIptDto, FromDistributorInfoTxn, IIptfindManyRes, IIptMessage, IIptValidationMessage, IptDelivaryChallanDetails, IptfindOneByIdRes, UpdateIptDto } from './ipt.dto';

// import { InvoiceType, ItemDetail } from '../invoice/invoice.interface';

import * as mongoose from 'mongoose';

import { ProfileService } from '../profile/profile.service';
import { CatalogService } from '../catalog/catalog.service';
import { LotDataService } from '../lot-data/lot-data.service';
import { LedgerItem } from './ledger.interface';
import { createLedgerStatementDto, IDashBoardSummary, IDashboardSummaryRes, ILedgerDatafindManyRes, ILedgerDataMessage, PARTICULARTYPE } from './ledger.dto';
import { Role } from '../roles/roles.enum';
import { ledgerSummaryDistributor } from './ledger.summary';
import { maxDate } from 'class-validator';
@Injectable()
export class LedgerService {

  constructor(
    @InjectModel('Ledger') public readonly Module: Model<LedgerItem>,

    // private invoiceService: InvoiceService, 
    private profileService: ProfileService,
    // private catalogService: CatalogService,
    // private lotDataService: LotDataService,


  ) { }



  async createModule(LedgerDataDto: createLedgerStatementDto, session?: any): Promise<IDataModuleRes<any>> {
    try {


      //   const getProfileInfo = await this.profileService.findOneModule(profileId);
      //   if (getProfileInfo && getProfileInfo.status === true &&
      //     getProfileInfo.data.roles[0] === Role.PLANT_MANAGER ||
      //     getProfileInfo.data.roles[0] === Role.ADMIN) {
      // if (1<2) {
      const createLedger = new this.Module(LedgerDataDto);
      const res = await createLedger.save(session ? { session } : undefined);
      // await createCreditNote.save(session ? {session} : undefined);
      // console.log(session)


      return {
        status: true, message: "IInvoiceMessage.createdSuccess", data: res
        // {
        // invoiceId: res._id,
        // invoiceNumber: res.uniqueNumber,
        // invoicePdfFileName: fileNameInv,
        // }
      }
      //   const createLedgerData = new this.Module(LedgerDataDto);
      //   await createLedgerData.save();
      //   console.log(createLedgerData, 'createLedgerData');
      //   return { status: true, data:createLedgerData, message: ILedgerDataMessage.createdSuccess }
      // } else {
      //   return { status: false, message: ILedgerDataMessage.failedUnauthorisedAccessCreate }
      // }
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






  async findManyModule(
    page: number,
    count: number,
    role: string,
    userLinkedToProfileId: any,
    statementProfileIdRequired?: any,
    filter?: string,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<ILedgerDatafindManyRes> {
    try {
      const company = await this.profileService.findCompanyModule(Role.COMPANY);
      console.log(userLinkedToProfileId, '1111')
      console.log(company)
      let getProfileInfo: any;
      let companyProfileId: any;
      if (company) {
        companyProfileId = company.data._id;
      }
      if (userLinkedToProfileId && role === Role.DISTRIBUTOR) {
        getProfileInfo = await this.profileService.findOneModuleByProfileId(userLinkedToProfileId);
      } else if (role === Role.ADMIN) {
        getProfileInfo = await this.profileService.findOneModuleByProfileId(userLinkedToProfileId);
      }
      let openingAccountStatementAmount: any;
      let openingAccountStatementAmountCrDr: any;
      let openingAccountStatementDate: any;
      let match = {};
      let matchDate = {};

      if (!statementProfileIdRequired && role === Role.ADMIN) {
        console.log('1')
        console.log(company.data)
        match = { ...match, ...{ partyProfileId: new mongoose.Types.ObjectId(company.data._id) } }
        openingAccountStatementAmount = company.data.accountingInfo.openingAccountStatementAmount;
        openingAccountStatementAmountCrDr = company.data.accountingInfo.openingAccountStatementAmountCrDr;
        openingAccountStatementDate = company.data.accountingInfo.openingAccountStatementDate;
      } else if (!statementProfileIdRequired && role === Role.DISTRIBUTOR) {
        openingAccountStatementAmount = getProfileInfo.data.accountingInfo.openingAccountStatementAmount;
        openingAccountStatementAmountCrDr = getProfileInfo.data.accountingInfo.openingAccountStatementAmountCrDr;
        openingAccountStatementDate = getProfileInfo.data.accountingInfo.openingAccountStatementDate;
        match = { ...match, ...{ partyProfileId: new mongoose.Types.ObjectId(getProfileInfo.data._id) } }
      } 
      if (statementProfileIdRequired) {
        console.log('12', statementProfileIdRequired)
        openingAccountStatementAmount = getProfileInfo.data.accountingInfo.openingAccountStatementAmount;
        openingAccountStatementAmountCrDr = getProfileInfo.data.accountingInfo.openingAccountStatementAmountCrDr;
        openingAccountStatementDate = getProfileInfo.data.accountingInfo.openingAccountStatementDate;
        match = { ...match, ...{ partyProfileId: new mongoose.Types.ObjectId(statementProfileIdRequired) } }
        console.log(match,'11')
      }
console.log(match, '123')
      if (openingAccountStatementAmountCrDr === 'DR') {
        openingAccountStatementAmount = openingAccountStatementAmount * -1;
      }

      if (dateFrom && dateTo) {
        if (new Date(dateFrom) <= new Date(dateTo)) {
          matchDate = { ...matchDate, ...{ txnDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } } };
          // dateFrom = dateFrom;
          // dateTo = dateTo;
        } else {
          return {
            status: false,
            message: 'IDashBoardSummary.dateError',
            data: null,
            info: null,
            totalCount: null
          };
        }
      }

      // count = Number(count || 100000000);
      // page = Number(page || 0);
      // let totalCount: any = [{ $count: 'count' }];
      // let item: any = [
      //   { $sort: { txnDate: 1 } },
      //   { $skip: page * count },
      //   { $limit: count },

      // ]

      if (filter && filter != '') {
        let search = {
          $or: [
            // { lotNo: { $regex: new RegExp(filter, "i") } },
            // { productName: { $regex: new RegExp(filter, "i") } },
            // { crop: { $regex: new RegExp(filter, "i") } },
          ]
        };
        match = { ...match, ...search };
      }

      // if (match ) {
      //   item.unshift({ $match: match });
      //   totalCount.unshift({ $match: match });
      // }
      let result = await this.Module.aggregate([














        { $match: match },
        { $sort: { "txnDate": 1 } },
        {
          $lookup: {
            from: 'orders',
            localField: "txnRefId",
            foreignField: "_id",
            as: "order_details"
          }
        },
        {
          $unwind: "$order_details"
        },
        {
          $addFields: {
            "value": {
              "$cond": [
                {
                  "$eq": ["$accountingType", 'DR']
                },
                {
                  "$multiply": [-1, "$amount"]
                },
                "$amount"
              ],
            },
          },
        },
        {
          $setWindowFields: {
            sortBy: { txnDate: 1 },
            output: {
              runningBalance: {
                $sum: "$value",
                window: { documents: ["unbounded", "current"] }
              }
            }
          }
        },
        {
          $addFields: { "runningBalance": { "$add": [openingAccountStatementAmount, "$runningBalance"] } }
        },
        {
          $addFields: {
            "runningBalanceCrDr": {
              "$cond": {
                if: { $lte: ["$runningBalance", 0] },
                then: "DR",
                else: "CR"
              }
            }
          },
        },
        {
          $addFields: {
            "runningBalance": {
              "$cond": {
                if: { $lte: ["$runningBalance", 0] },
                then: {
                  "$multiply": [-1, "$runningBalance"]
                },
                else: "$runningBalance"
              }
            }
          },
        },
        // {
        //   $match: matchDate
        // },

        // {
        //   "$project": {
        //     "partyName": 1,
        //     "txnDate": 1,
        //     "accountingType": 1,
        //     "amount": 1,
        //     "narration": 1,
        //     "txnRefId": 1,
        //     "particularType": 1,
        //     "vchType": 1,
        //     "vchNumber": 1,
        //     "comment": 1,
        //     "openingAccountStatementAmount": 1,
        //     "openingAccountStatementDate": 1,
        //     // "ipt_details.items": 1,
        //     "runningBalance": 1,
        //     "runningBalanceCrDr": {
        //       "$cond": {
        //         if: runningBalance < 0,
        //         then: "Dr",
        //         else: "Cr"
        //       }



        //     }
        // }
        // }









      ]);

      if (openingAccountStatementAmount < 0) {
        openingAccountStatementAmount = openingAccountStatementAmount * -1;
      }

      let info: any = { "openingAccountStatementAmount": openingAccountStatementAmount, "openingAccountStatementDate": openingAccountStatementDate, "openingAccountStatementAmountCrDr": openingAccountStatementAmountCrDr }
      if (result && result.length > 0) {
        // if (result && result[0].item.length > 0) {
        return {
          status: true,
          message: "ILotDataMessage.foundSuccess",
          data: result,
          info: info,
          totalCount: result.length,
        };
      } else {
        return {
          status: false,
          message: "ILotDataMessage.notFound",
          data: null,
          info: null,
          totalCount: 0,
        };
      }
    }
    // else {
    //   return {
    //     status: false,
    //     message: "ILotDataMessage.failedUnauthorisedAccessFind",
    //     data: null,
    //     info: null,
    //     totalCount: 0,
    //   };
    // }
    // } 
    catch (error) {
      throw error;
    }
  }




















































  async aggregateDashboardFinancialsForDistributor(profileId: any, dateFrom?: Date, dateTo?: Date): Promise<IDashboardSummaryRes> {
    try {
      let match = {};
      let ledgerSummaryDistributorDto: ledgerSummaryDistributor = {
        grossPurchases: 0,
        creditNoteReceived: 0,
        creditNoteReceivedForIptTransfer: 0,
        creditNoteReceivedForSalesReturn: 0,
        netPurchases: 0,
        otherCredits: 0,
        otherDebits: 0,
        paymentsMade: 0,
        discountReceived: 0,
        pendingPayable: 0,
        profileId: ''
      }
      if (profileId) {
        match = { ...match, ...{ partyProfileId: new mongoose.Types.ObjectId(profileId) } };
        ledgerSummaryDistributorDto.profileId = profileId;
      }
      if (dateFrom && dateTo) {
        if (new Date(dateFrom) <= new Date(dateTo)) {
          match = { ...match, ...{ txnDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } } };
          ledgerSummaryDistributorDto.dateFrom = dateFrom;
          ledgerSummaryDistributorDto.dateTo = dateTo;
        } else {
          return {
            status: false,
            message: IDashBoardSummary.dateError,
            data: null,
          };
        }
      }
      let result = await this.Module.aggregate([
        {
          $match: match
        },
        {
          $group: {
            _id: "$particularType", totalAmount: { $sum: "$amount" },
          },
        },
      ]);
      if (result && result.length > 0) {
        for (let item of result) {
          if (PARTICULARTYPE.PURCHASES === item._id) {
            ledgerSummaryDistributorDto.grossPurchases = item.totalAmount;
          }
          if (PARTICULARTYPE.IPT_GOODS_TRANSFER === item._id) {
            ledgerSummaryDistributorDto.creditNoteReceivedForIptTransfer = item.totalAmount;
          }
          if (PARTICULARTYPE.SALES_RETURN === item._id) {
            ledgerSummaryDistributorDto.creditNoteReceivedForSalesReturn = item.totalAmount;
          }
          // other credits   (example is transportation)
          // if (PARTICULARTYPE.PAYMENT_MADE === item._id) {
          //   ledgerSummaryDistributorDto.paymentsMade = item.totalAmount;
          // }
          // other debits  (example is expenses incurred for the distributor)
          // if (PARTICULARTYPE.PAYMENT_MADE === item._id) {
          //   ledgerSummaryDistributorDto.paymentsMade = item.totalAmount;
          // }
          if (PARTICULARTYPE.PAYMENT_MADE === item._id) {
            ledgerSummaryDistributorDto.paymentsMade = item.totalAmount;
          }
          if (PARTICULARTYPE.DISCOUNTS_RECEIVED === item._id) {
            ledgerSummaryDistributorDto.discountReceived = item.totalAmount;
          }
        }
        ledgerSummaryDistributorDto.creditNoteReceived = ledgerSummaryDistributorDto.creditNoteReceivedForIptTransfer + ledgerSummaryDistributorDto.creditNoteReceivedForSalesReturn;
        ledgerSummaryDistributorDto.netPurchases = ledgerSummaryDistributorDto.grossPurchases - ledgerSummaryDistributorDto.creditNoteReceived;
        ledgerSummaryDistributorDto.pendingPayable = ledgerSummaryDistributorDto.netPurchases + ledgerSummaryDistributorDto.otherCredits - ledgerSummaryDistributorDto.otherDebits + ledgerSummaryDistributorDto.discountReceived + ledgerSummaryDistributorDto.paymentsMade;
        return {
          status: true,
          message: IDashBoardSummary.dashBoardSummarySuccess,
          data: ledgerSummaryDistributorDto,
        };
      } else {
        return {
          status: false,
          message: IDashBoardSummary.dashBoardSummaryFailed,
          data: null,
        };
      }
    } catch (error) {
      throw error;
    }
  }









}