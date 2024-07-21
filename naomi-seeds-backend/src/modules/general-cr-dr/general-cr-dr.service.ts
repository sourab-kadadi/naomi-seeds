import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IModuleRes } from '../../common.service';
// import { ApprovalStatus, IPT } from './ipt.interface';
// import { FromDistributorApproval, IPT, ManagerApprovalGenerateDC, SalesOfficerApprovalStatus, ToDistributorConfirmation, ManagerFinalApproval, IPTtransaction } from '../ipt/ipt.interface';
// import { CreateIptDto, FromDistributorInfoTxn, IIptfindManyRes, IIptMessage, IIptValidationMessage, IptDelivaryChallanDetails, IptfindOneByIdRes, typeOfSale, UpdateIptDto } from '../ipt/ipt.dto';

// import { InvoiceType, ItemDetail } from '../invoice/invoice.interface';

import * as mongoose from 'mongoose';

import { ProfileService } from '../profile/profile.service';
import { CatalogService } from '../catalog/catalog.service';
import { LotDataService } from '../lot-data/lot-data.service';
import { Role } from '../roles/roles.enum';
import { PdfServiceService } from '../pdf-service/pdf-service.service';
import * as hexgen from 'hex-generator';
import { ToWords } from 'to-words';
import { LedgerService } from '../ledger/ledger.service';
import {
  ACCOUNTINGTYPE,
  createLedgerStatementDto,
  PARTICULARTYPE,
} from '../ledger/ledger.dto';
import { GeneralCrDr } from './general-cr-dr.interface';
import {
  CreateDiscountProductDto,
  typeOfEntry,
  IGenCrDrfindOneByIdRes,
  IGenCrDrMessage,
  transactionApproval,
  generalCrDrLedgerDto,
  IGenCrDrfindManyRes,
} from './general-cr-dr.dto';

@Injectable()
export class GeneralCrDrService {
  constructor(
    @InjectModel('GeneralCrDr') private readonly Module: Model<GeneralCrDr>,

    private profileService: ProfileService,
    private catalogService: CatalogService,
    private lotDataService: LotDataService,
    private readonly pdfService: PdfServiceService,
    private ledgerService: LedgerService,
  ) {}

  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  //create discount entry
  async createModuleDiscountEntry(
    createDiscountProductDto: CreateDiscountProductDto,
    user: any,
  ): Promise<IModuleRes> {
    try {
      const lastSavedDoc = await this.Module.find({})
        .sort({ _id: -1 })
        .limit(1);
      if (
        lastSavedDoc &&
        lastSavedDoc.length &&
        lastSavedDoc[0].genCrDrNumber
      ) {
        const newGenCrDrNumber =
          Number(lastSavedDoc[0]['genCrDrNumber'].split('-')[2]) + 1;
        createDiscountProductDto['genCrDrNumber'] =
          'NS-GTXN-' + String(newGenCrDrNumber);
      } else {
        const newGenCrDrNumber = 1;
        createDiscountProductDto['genCrDrNumber'] =
          'NS-GTXN-' + String(newGenCrDrNumber);
      }
      if (user.roles[0] === Role.ACCOUNTANT) {
        createDiscountProductDto.accountantId = user.profileId;
        createDiscountProductDto.accountantName = `${user.firstName} ${user.lastName}`;
      } else if (user.roles[0] === Role.ADMIN) {
        createDiscountProductDto.adminId = user.profileId;
        createDiscountProductDto.adminName = `${user.firstName} ${user.lastName}`;
      }
      createDiscountProductDto.fromDistributorRole = Role.COMPANY;
      createDiscountProductDto.typeOfEntry =
        typeOfEntry.DISCOUNTS_FOR_PRODUCT_PURCHASES;
      const getFromDistributorInfoTxn =
        await this.profileService.findCompanyModule(Role.COMPANY);
      const getToDistributorInfoTxn = await this.profileService.findOneModule(
        createDiscountProductDto.toDistributorId,
      );
      createDiscountProductDto.salesPersonId =
        getToDistributorInfoTxn.data.profileReportsToId;
      const salesPersonID = getToDistributorInfoTxn.data.profileReportsToId;
      createDiscountProductDto.salesPersonName =
        getToDistributorInfoTxn.data.profileReportsToName;
      if (salesPersonID) {
        const getsalesPersonInfo = await this.profileService.findOneModule(
          salesPersonID,
        );
        createDiscountProductDto.managerId =
          getsalesPersonInfo.data.profileReportsToId;
        createDiscountProductDto.managerName =
          getsalesPersonInfo.data.profileReportsToName;
      }
      createDiscountProductDto.fromDistributorId =
        getFromDistributorInfoTxn.data[0]._id;
      createDiscountProductDto.fromDistributorName =
        getFromDistributorInfoTxn.data[0].companyName;
      createDiscountProductDto.transactionApproval =
        transactionApproval.PENDING;
      const createGeneralCrDr = new this.Module(createDiscountProductDto);
      await createGeneralCrDr.save();
      return { status: true, message: IGenCrDrMessage.createdSuccess };
    } catch (error) {
      if (error.code && error.code == 11000) {
        const findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        const DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + ' Already Exist',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

  //   async updateModule(_id: string, deliveryChallanDto: UpdateIptDto): Promise<IModuleRes> {
  //     try {
  //       let result = await this.Module.updateOne({ _id: _id }, { $set: deliveryChallanDto });
  //       return { status: true, message: IIptMessage.updateSuccess }
  //     } catch (error) {
  //       if (error.code && error.code == 11000) {
  //         let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //         let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //         throw new HttpException(
  //           DuplicateArrayToString + ' Already Exist',
  //           HttpStatus.CONFLICT,
  //         );
  //       } else {
  //         throw error;
  //       }
  //     }
  //   }

  //   async deleteModule(_id: string): Promise<IModuleRes> {
  //     try {
  //       await this.Module.deleteOne({ _id: _id });
  //       return { status: true, message: IIptMessage.deleteSuccess }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  async findOneModule(_id: string): Promise<IGenCrDrfindOneByIdRes> {
    try {
      const result = await this.Module.findOne({ _id: _id });
      if (result) {
        return {
          status: true,
          message: IGenCrDrMessage.foundSuccess,
          data: result,
        };
      } else {
        return { status: false, message: IGenCrDrMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }

  //   async findOneModuleByUser(_id: string, profileId: string): Promise<IptfindOneByIdRes> {
  //     try {
  //       let result = await this.Module.findOne({ _id: _id, $or:[{fromDistributorId: new mongoose.Types.ObjectId(profileId)}, {toDistributorId: new mongoose.Types.ObjectId(profileId)}, {salesPersonId: new mongoose.Types.ObjectId(profileId)}, {plantManagerId: new mongoose.Types.ObjectId(profileId)}, {managerId: new mongoose.Types.ObjectId(profileId)} ] });
  //       if (result) {
  //         return { status: true, message: IIptMessage.foundSuccess, data: result }
  //       } else {
  //         return { status: false, message: IIptMessage.notFound, data: null }
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  // find many for Accountant
  async findManyModuleAccountant(
    page: number,
    count: number,
    user: any,
    filter?: string,
    status?: boolean,

    transactionApproval?: string,
    // plantManagerId?: string,
    // salesPersonId?: string,
    // managerId?: string,
    // fromDistributorId?: string,
    // toDistributorId?: string,
    // fromDistributorApproval?: string,

    // salesOfficerApprovalStatus?: string,
    // toDistributorConfirmation?: string,
    // managerFinalApproval?: string,
    // pendingApproval?: string,
    // pendingApprovalsManager?: string,
  ): Promise<IGenCrDrfindManyRes> {
    try {
      let match = {};
      if (transactionApproval) {
        match = { ...match, ...{ transactionApproval: transactionApproval } };
      }
      // if (managerId) {
      //   match = { ...match, ...{ managerId: new mongoose.Types.ObjectId(managerId) } }
      // }
      // if (toDistributorId) {
      //   match = { ...match, ...{ toDistributorId: new mongoose.Types.ObjectId(toDistributorId) } }
      // }
      // if (managerApprovalGenerateDC) {
      //   match = { ...match, ...{ managerApprovalGenerateDC: managerApprovalGenerateDC } };
      // }
      // if (salesOfficerApprovalStatus) {
      //   match = { ...match, ...{ salesOfficerApprovalStatus: salesOfficerApprovalStatus } };
      // }
      // if (toDistributorConfirmation) {
      //   match = { ...match, ...{ toDistributorConfirmation: toDistributorConfirmation } };
      // }
      // if (managerFinalApproval) {
      //   match = { ...match, ...{ managerFinalApproval: managerFinalApproval } };
      // }
      count = Number(count || 10);
      page = Number(page || 0);
      const totalCount: any = [{ $count: 'count' }];
      const item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
        // {$project: {
        //   _id: 1,
        //   fromDistributorApproval: 1,
        //   fromDistributorId: 1,
        //   fromDistributorName: 1,
        //   managerApprovalGenerateDC: 1,
        //   managerFinalApproval: 1,
        //   salesOfficerApprovalStatus: 1,
        //   salesOrderDate: 1,
        //   salesOrderNumber: 1,
        //   salesPersonId: 1,
        //   salesPersonName: 1,
        //   toDistributorConfirmation: 1,
        //   toDistributorId: 1,
        //   toDistributorName: 1,
        //   totalQuantity: 1,
        //   totalUnits: 1,
        //   totalValue: 1,
        //   managerName: 1
        // }}
      ];
      if (filter && filter != '') {
        const search = {
          $or: [
            { fromDistributorName: { $regex: new RegExp(filter, 'i') } },
            { toDistributorName: { $regex: new RegExp(filter, 'i') } },
            { salesPersonName: { $regex: new RegExp(filter, 'i') } },
            { managerName: { $regex: new RegExp(filter, 'i') } },
            { salesOrderNumber: { $regex: new RegExp(filter, 'i') } },
          ],
        };
        match = { ...match, ...search };
      }
      if (match) {
        item.unshift({ $match: match });
        totalCount.unshift({ $match: match });
      }

      const result = await this.Module.aggregate([
        {
          $facet: {
            item: item,
            totalCount: totalCount,
          },
        },
      ]);

      if (result && result[0].item.length > 0) {
        return {
          status: true,
          message: IGenCrDrMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IGenCrDrMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  //   async findManyModule(
  //     page: number,
  //     count: number,
  //     filter?: string,
  //     status?: boolean,
  //     salesPersonId?: string,
  //     fromDistributorId?: string,
  //     toDistributorId?: string,
  //     fromDistributorApproval?: string,
  //     managerApprovalGenerateDC?: string,
  //     salesOfficerApprovalStatus?: string,
  //     toDistributorConfirmation?: string,
  //     managerFinalApproval?: string,
  //     pendingApproval?: string,
  //     pendingApprovalsManager?: boolean,
  //   ): Promise<IIptfindManyRes> {
  //     try {

  //       let match = {};
  //       if (salesPersonId) {
  //         match = { ...match, ...{ salesPersonId: new mongoose.Types.ObjectId(salesPersonId) } }
  //       }
  //       if (toDistributorId || fromDistributorId) {
  //         match = { ...match, ...{
  //           $and: [{$or: [{ fromDistributorId: new mongoose.Types.ObjectId(fromDistributorId) }, { toDistributorId: new mongoose.Types.ObjectId(toDistributorId) }]}]
  //         }}
  //       }
  //       if (fromDistributorApproval) {
  //         match = { ...match, ...{ fromDistributorApproval: fromDistributorApproval } };

  //       }
  //       if (managerApprovalGenerateDC) {
  //         match = { ...match, ...{ managerApprovalGenerateDC: managerApprovalGenerateDC } };
  //       }
  //       if (salesOfficerApprovalStatus) {
  //         match = { ...match, ...{ salesOfficerApprovalStatus: salesOfficerApprovalStatus } };
  //       }
  //       if (toDistributorConfirmation) {
  //         match = { ...match, ...{ toDistributorConfirmation: toDistributorConfirmation } };
  //       }
  //       if (managerFinalApproval) {
  //         match = { ...match, ...{ managerFinalApproval: managerFinalApproval } };
  //       }
  //       if (pendingApproval) {
  //         match = {
  //           ...match, ...{
  //             $or: [
  //               { $and: [{ fromDistributorApproval: "PENDING" }, { fromDistributorId: new mongoose.Types.ObjectId(fromDistributorId) }] },
  //               { $and: [{ fromDistributorApproval: "APPROVED" }, { toDistributorConfirmation: "PENDING" }, { toDistributorId: new mongoose.Types.ObjectId(toDistributorId) }] }
  //             ]
  //           }
  //         };
  //       }
  //       if (pendingApprovalsManager) {

  //         match = {
  //           ...match, ...{
  //             $or: [
  //               { $and: [{ fromDistributorApproval: "APPROVED" }, { managerApprovalGenerateDC: "PENDING" }] },
  //               { $and: [{ toDistributorConfirmation: "RECEIVED" }, { managerFinalApproval: "PENDING" }] }
  //             ]
  //           }

  //         };

  //       }
  //       count = Number(count || 10);
  //       page = Number(page || 0);
  //       let totalCount: any = [{ $count: 'count' }];
  //       let item: any = [
  //         { $sort: { _id: 1 } },
  //         { $skip: page * count },
  //         { $limit: count },
  //         {$project: {
  //           _id: 1,
  //           fromDistributorApproval: 1,
  //           fromDistributorId: 1,
  //           fromDistributorName: 1,
  //           managerApprovalGenerateDC: 1,
  //           managerFinalApproval: 1,
  //           salesOfficerApprovalStatus: 1,
  //           salesOrderDate: 1,
  //           salesOrderNumber: 1,
  //           salesPersonId: 1,
  //           salesPersonName: 1,
  //           toDistributorConfirmation: 1,
  //           toDistributorId: 1,
  //           toDistributorName: 1,
  //           totalQuantity: 1,
  //           totalUnits: 1,
  //           totalValue: 1
  //         }}
  //       ]
  //       if (filter && filter != '') {
  //         let search = {
  //           $or: [
  //             { fromDistributorName: { $regex: new RegExp(filter, "i") } },
  //             { toDistributorName: { $regex: new RegExp(filter, "i") } },
  //             { salesPersonName: { $regex: new RegExp(filter, "i") } },
  //             { salesOrderNumber: { $regex: new RegExp(filter, "i") } },
  //           ]
  //         };
  //         match = { ...match, ...search };
  //       }
  //       if (match ) {
  //         item.unshift({ $match: match });
  //         totalCount.unshift({ $match: match });
  //       }

  //       let result = await this.Module.aggregate([
  //         {
  //           $facet: {
  //             item: item,
  //             totalCount: totalCount,
  //           },
  //         }
  //       ]);

  //       if (result && result[0].item.length > 0) {
  //         return {
  //           status: true,
  //           message: IIptMessage.foundSuccess,
  //           data: result[0].item,
  //           totalCount: result[0].totalCount[0].count,
  //         };
  //       } else {
  //         return {
  //           status: false,
  //           message: IIptMessage.notFound,
  //           data: null,
  //           totalCount: 0,
  //         };
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async fromDistributorApprove(_id: string): Promise<IptfindOneByIdRes> {
  //     try {
  //       let result = await this.Module.updateOne({ _id: _id, fromDistributorApproval: FromDistributorApproval.PENDING }, { $set: { fromDistributorApproval: FromDistributorApproval.APPROVED } });
  //       if (result) {
  //         return { status: true, message: IIptMessage.foundSuccess, data: result }
  //       } else {
  //         return { status: false, message: IIptMessage.notFound, data: null }
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async managerApprovalDC(_id: string): Promise<IptfindOneByIdRes> {
  //     const delivaryChallanSession = await this.delivaryChallanService.Module.db.startSession();
  //     delivaryChallanSession.startTransaction();
  //     try {
  //       const getIptInfo = await this.Module.findOne({ _id: _id, managerApprovalGenerateDC: ManagerApprovalGenerateDC.PENDING });
  //       const delivaryChallanObj = await this.generateDelivaryChallanObj(getIptInfo);
  //       let delivaryChallanRes = await this.delivaryChallanService.delivaryChallenCreateModule(delivaryChallanObj, delivaryChallanSession);
  //       let result = await this.Module.updateOne({ _id: _id, managerApprovalGenerateDC: ManagerApprovalGenerateDC.PENDING },
  //         {
  //           $set: {
  //             managerApprovalGenerateDC: ManagerApprovalGenerateDC.APPROVED,
  //             delivaryChallanId: delivaryChallanRes.data.delivaryChallanId,
  //             dcPdfFileName: delivaryChallanRes.data.dcPdfFileName,
  //             delivaryChallanNumber: delivaryChallanRes.data.delivaryChallanNumber
  //           }
  //         });
  //       if (result) {
  //         await delivaryChallanSession.commitTransaction();
  //         return { status: true, message: IIptMessage.dcSessionSuccess, data: null }
  //       } else {
  //         delivaryChallanSession.abortTransaction();
  //         return { status: false, message: IIptMessage.dcSessionFailed, data: null }
  //       }
  //     } catch (error) {
  //       delivaryChallanSession.abortTransaction();
  //       throw error;
  //     } finally {
  //       delivaryChallanSession.endSession();
  //     }
  //   }

  //   async generateDelivaryChallanObj(iptDoc: IPTtransaction): Promise<CreateDeliveryChallanDtoforIPT> {
  //     let delivaryChallan: CreateDeliveryChallanDtoforIPT = {
  //       iptId: iptDoc._id,
  //       dcNumber: iptDoc.salesOrderNumber.replace("TXN", "DC"),
  //       fromDistributorId: iptDoc.fromDistributorId,
  //       fromDistributorName: iptDoc.fromDistributorName,
  //       toDistributorId: iptDoc.toDistributorId,
  //       toDistributorName: iptDoc.toDistributorName,
  //       salesPersonId: iptDoc.salesPersonId,
  //       salesPersonName: iptDoc.salesPersonName,
  //       salesOrderDate: iptDoc.salesOrderDate,
  //       items: [],
  //       totalUnits: iptDoc.totalUnits,
  //       totalQuantity: iptDoc.totalQuantity,
  //       totalValue: iptDoc.totalValue,
  //       rrOrLrNum: iptDoc.rrOrLrNum,
  //       vehicleNo: iptDoc.vehicleNo,
  //       transport: iptDoc.transport,
  //       freightTotal: iptDoc.freightTotal,
  //       frightPaidAdvance: iptDoc.frightPaidAdvance,
  //       frightToPay: iptDoc.frightToPay,
  //       toDistributorInfoTxn: {
  //         gstin: iptDoc.toDistributorInfoTxn.gstin,
  //         email: iptDoc.toDistributorInfoTxn.email,
  //         phoneNo: iptDoc.toDistributorInfoTxn.phoneNo,
  //         address1: iptDoc.toDistributorInfoTxn.address1,
  //         address2: iptDoc.toDistributorInfoTxn.address2,
  //         city: iptDoc.toDistributorInfoTxn.city,
  //         taluka: iptDoc.toDistributorInfoTxn.taluka,
  //         district: iptDoc.toDistributorInfoTxn.district,
  //         state: iptDoc.toDistributorInfoTxn.state,
  //         pincode: iptDoc.toDistributorInfoTxn.pincode,
  //       },
  //     };
  //     delivaryChallan.items = iptDoc.items.map(data => {
  //       let item: ItemDetail = {
  //         productName: data.productName,
  //         lotNumber: data.lotNumber,
  //         crop: data.crop,
  //         hnsNumber: data.hnsNumber,
  //         quantity: data.quantity,
  //         packingSizeinKg: data.packingSizeinKg,
  //         numberOfPacketsOrdered: data.numberOfPacketsOrdered,
  //         rate: data.rate,
  //         unit: data.unit,
  //         amount: data.amount,
  //         productDetails: data.productDetails,
  //         lotDetails: data.lotDetails
  //       }
  //       return item;
  //     });
  //     return delivaryChallan;
  //   }

  //   async salesOfficerShippingUpdate(_id: string): Promise<IptfindOneByIdRes> {
  //     try {
  //       let result = await this.Module.updateOne({ _id: _id, salesOfficerApprovalStatus: SalesOfficerApprovalStatus.PENDING }, { $set: { salesOfficerApprovalStatus: SalesOfficerApprovalStatus.SHIPPED } });
  //       if (result) {
  //         return { status: true, message: IIptMessage.foundSuccess, data: result }
  //       } else {
  //         return { status: false, message: IIptMessage.notFound, data: null }
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async receipentDistributorConfirmation(_id: string): Promise<IptfindOneByIdRes> {
  //     try {
  //       let result = await this.Module.updateOne({ _id: _id, toDistributorConfirmation: ToDistributorConfirmation.PENDING }, { $set: { toDistributorConfirmation: ToDistributorConfirmation.RECEIVED } });
  //       if (result) {
  //         return { status: true, message: IIptMessage.foundSuccess, data: result }
  //       } else {
  //         return { status: false, message: IIptMessage.notFound, data: null }
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  // // for sales order approval by manager
  //   async managerCompleteTxnSales(_id: string): Promise<IptfindOneByIdRes> {
  //     const ledgerSession = await this.ledgerService.Module.db.startSession();
  //     ledgerSession.startTransaction();
  //     try {
  //       const getcompanyInfo = await this.profileService.findCompanyModule(Role.COMPANY);
  //       const getIptInfo = await this.Module.findOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING });
  //       const invoiceSalesObj = await this.geneRateInvoiceObj(getIptInfo, InvoiceType.INVOICE, getcompanyInfo);
  //       // const creditSalesObj = await this.geneRateCreditObj(getIptInfo, InvoiceType.CREDIT_NOTE);
  //       let invoiceRes = await this.createInvoicePdf(invoiceSalesObj);
  //       // let CreditRes = await this.createCreditPdf(creditSalesObj);
  //       const generateLedgerDebit = await this.generateLedgerDebitObj(getIptInfo)
  //       const generateLedgerCredit = await this.generateLedgerCreditObj(getIptInfo)
  //       let ledgerDebitRes = await this.ledgerService.createModule(generateLedgerDebit, ledgerSession);
  //       let ledgerCreditRes = await this.ledgerService.createModule(generateLedgerCredit, ledgerSession);
  //       let result = await this.Module.updateOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING },
  //         {
  //           $set: {
  //             managerFinalApproval: ManagerFinalApproval.APPROVED,
  //             // invoiceId: invoiceModuleRes.data.invoiceId,
  //             invoicePdfFileName: invoiceRes.data.invoicePdfFileName,
  //             invoiceNumber: invoiceRes.data.invoiceNumber,
  //             ledgerCreditId: ledgerCreditRes.data._id,
  //             ledgerDebitId: ledgerDebitRes.data._id
  //             // creditNoteId: creditNoteModuleRes.data.creditNoteId,
  //             // creditNotePdfFileName: creditNoteModuleRes.data.creditNotePdfFileName,
  //             // creditNoteNumber: creditNoteModuleRes.data.creditNoteNumber,
  //           }
  //         });

  //       if (result) {
  //         await ledgerSession.commitTransaction();
  //         return { status: true, message: IIptMessage.ledgerSessionSuccess, data: null }
  //       } else {
  //         ledgerSession.abortTransaction();
  //         return { status: false, message: IIptMessage.ledgerSessionFailed, data: null }
  //       }
  //     } catch (error) {
  //       ledgerSession.abortTransaction();
  //       throw error;
  //     } finally {
  //       ledgerSession.endSession();
  //     }
  //   }

  // this is done //////////
  async saveAndCreateLedgerEntry(_id: string): Promise<IGenCrDrfindOneByIdRes> {
    const ledgerSession = await this.ledgerService.Module.db.startSession();
    ledgerSession.startTransaction();
    try {
      // const getcompanyInfo = await this.profileService.findCompanyModule(Role.COMPANY);
      const getDetailInfo = await this.Module.findOne({
        _id: _id,
        transactionApproval: transactionApproval.PENDING,
      });
      // const invoiceSalesObj = await this.geneRateInvoiceObj(getIptInfo, InvoiceType.INVOICE, getcompanyInfo);
      // const creditSalesObj = await this.geneRateCreditObj(getIptInfo, InvoiceType.CREDIT_NOTE, getcompanyInfo);

      // let invoiceRes = await this.createInvoicePdf(invoiceSalesObj);
      // let CreditRes = await this.createCreditPdf(creditSalesObj);
      const generateLedgerDebit = await this.generateLedgerDebitObj(
        getDetailInfo,
      );
      const generateLedgerCredit = await this.generateLedgerCreditObj(
        getDetailInfo,
      );
      const ledgerDebitRes1 = await this.ledgerService.createModule(
        generateLedgerDebit,
        ledgerSession,
      );
      const ledgerCreditRes1 = await this.ledgerService.createModule(
        generateLedgerCredit,
        ledgerSession,
      );
      const result = await this.Module.updateOne(
        { _id: _id, transactionApproval: transactionApproval.PENDING },
        {
          $set: {
            transactionApproval: transactionApproval.APPROVED,
            // invoiceId: invoiceModuleRes.data.invoiceId,
            // invoicePdfFileName: invoiceRes.data.invoicePdfFileName,
            // invoiceNumber: invoiceRes.data.invoiceNumber,
            // ledgerCreditId: ledgerCreditRes1.data._id,
            // ledgerDebitId: ledgerDebitRes1.data._id,
            // ledgerCreditIdIPTPart2: ledgerCreditRes2.data._id,
            // ledgerDebitIdIPTPart2: ledgerDebitRes2.data._id,
            // // creditNoteId: creditNoteModuleRes.data.creditNoteId,
            // creditNotePdfFileName: CreditRes.data.creditNotePdfFileName,
            // creditNoteNumber: CreditRes.data.creditNoteNumber,
          },
        },
      );
      if (result) {
        await ledgerSession.commitTransaction();
        return {
          status: true,
          message: IGenCrDrMessage.ledgerSessionSuccess,
          data: null,
        };
      } else {
        ledgerSession.abortTransaction();
        return {
          status: false,
          message: IGenCrDrMessage.ledgerSessionFailed,
          data: null,
        };
      }
    } catch (error) {
      ledgerSession.abortTransaction();
      throw error;
    } finally {
      ledgerSession.endSession();
    }
  }

  //   // async createInvoice(InvoiceDto: any): Promise<IDataModuleRes<IInvoiceSaveRes>> {
  //       async createInvoice(InvoiceDto: any): Promise<any> {
  //     try {
  //       const hexString = hexgen(128);
  //       const fileNameInv = hexString + InvoiceDto.uniqueNumber + '.pdf';
  //       InvoiceDto.invoicePdfFileName = fileNameInv
  //       const dataPdfService = await this.pdfService.generatePDFToS3('invoice', fileNameInv, {
  //         locals:
  //         {
  //           invoice: InvoiceDto,
  //           amountInWords: this.toWords.convert(InvoiceDto.totalValue),
  //         }
  //       });

  //       return {
  //         status: true, message: "IInvoiceMessage.createdSuccess", data: {
  //           invoiceNumber: InvoiceDto.uniqueNumber,
  //           invoicePdfFileName: fileNameInv,
  //         }
  //       }
  //     } catch (error) {
  //       if (error.code && error.code == 11000) {
  //         let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //         let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //         throw new HttpException(
  //           DuplicateArrayToString + ' Aleary Exist',
  //           HttpStatus.CONFLICT,
  //         );
  //       } else {
  //         throw error;
  //       }
  //     }
  //   }

  //   // async createInvoice(InvoiceDto: any): Promise<IDataModuleRes<IInvoiceSaveRes>> {
  //     async createInvoicePdf(InvoiceDto: any): Promise<any> {
  //       try {
  //         const hexString = hexgen(128);
  //         const fileNameInv = hexString + InvoiceDto.uniqueNumber + '.pdf';
  //         InvoiceDto.invoicePdfFileName = fileNameInv
  //         const dataPdfService = await this.pdfService.generatePDFToS3('invoice', fileNameInv, {
  //           locals:
  //           {
  //             invoice: InvoiceDto,
  //             amountInWords: this.toWords.convert(InvoiceDto.totalValue),
  //           }
  //         });

  //         return {
  //           status: true, message: "IInvoiceMessage.createdSuccess", data: {
  //             invoiceNumber: InvoiceDto.uniqueNumber,
  //             invoicePdfFileName: fileNameInv,
  //           }
  //         }
  //       } catch (error) {
  //         if (error.code && error.code == 11000) {
  //           let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //           let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //           throw new HttpException(
  //             DuplicateArrayToString + ' Aleary Exist',
  //             HttpStatus.CONFLICT,
  //           );
  //         } else {
  //           throw error;
  //         }
  //       }
  //     }

  //   // async createCreditPdf(createNoteDto: any, session?: any): Promise<IDataModuleRes<ICreditNoteSaveRes>> {
  //       async createCreditPdf(createNoteDto: any, session?: any): Promise<any> {
  //     try {
  //       const hexString = hexgen(128);
  //       const fileNameCN = hexString + createNoteDto.uniqueNumber + '.pdf';
  //       createNoteDto.creditNotePdfFileName = fileNameCN
  //       const createCreditNote = new this.Module(createNoteDto);
  //       const dataPdfService = await this.pdfService.generatePDFToS3('credit-note', fileNameCN, {
  //         locals:
  //         {
  //           creditNote: createNoteDto,
  //           amountInWords: this.toWords.convert(createNoteDto.totalValue),
  //         }
  //       });

  //       // const res = await createCreditNote.save(session ? { session } : undefined);
  //       // await createCreditNote.save(session ? {session} : undefined);
  //       return {
  //         status: true, message: "IInvoiceMessage.createdSuccess", data: {
  //           // creditNoteId: res._id,
  //           creditNoteNumber: createNoteDto.uniqueNumber,
  //           creditNotePdfFileName: fileNameCN,
  //         }
  //       }
  //     } catch (error) {
  //       if (error.code && error.code == 11000) {
  //         let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //         let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //         throw new HttpException(
  //           DuplicateArrayToString + ' Aleary Exist',
  //           HttpStatus.CONFLICT,
  //         );
  //       } else {
  //         throw error;
  //       }
  //     }
  //   }

  // async generateLedgerDebitObj(iptDoc: IPTtransaction, invoiceType: InvoiceType): Promise<CreateInvoiceDto> {
  async generateLedgerDebitObj(crDrDoc: any): Promise<any> {
    const ledger: createLedgerStatementDto = {
      partyProfileId: crDrDoc.toDistributorId,
      partyName: crDrDoc.toDistributorName,
      oppositePartyProfileId: crDrDoc.fromDistributorId,
      oppositePartyName: crDrDoc.fromDistributorName,
      txnRefId: crDrDoc._id,
      txnRefCollection: 'GENERALCRDR',
      txnDate: crDrDoc.genCrDrDate,
      accountingType: ACCOUNTINGTYPE.DR,
      particularType: PARTICULARTYPE.DISCOUNTS_GIVEN,
      amount: crDrDoc.totalValue,
      narration: `Discount from NSPL to ${crDrDoc.toDistributorName}`,
    };
    return ledger;
  }

  async generateLedgerCreditObj(crDrDoc: any): Promise<any> {
    const ledger: createLedgerStatementDto = {
      partyProfileId: crDrDoc.fromDistributorId,
      partyName: crDrDoc.fromDistributorName,
      oppositePartyProfileId: crDrDoc.toDistributorId,
      oppositePartyName: crDrDoc.toDistributorName,
      txnRefId: crDrDoc._id,
      txnRefCollection: 'GENERALCRDR',
      txnDate: crDrDoc.genCrDrDate,
      accountingType: ACCOUNTINGTYPE.CR,
      particularType: PARTICULARTYPE.DISCOUNTS_RECEIVED,
      amount: crDrDoc.totalValue,
      narration: `Discount from NSPL to ${crDrDoc.toDistributorName}`,
    };
    return ledger;
  }

  //   async onDashboardSummaryProductsPurchasedDist(
  //     page: number,
  //     count: number,
  //     user: any,
  //     filter?: string,
  //     selectionType?: string,
  //     dateFrom?: Date,
  //     dateTo?: Date,
  //   ): Promise<
  //   // IIptfindManyRes
  //   any
  //   > {
  //     try {
  // // console.log(profileId);
  //       let match = {};
  //       let matchSearch = {};
  //       // match = { ...match, ...{ managerFinalApproval: ManagerFinalApproval.APPROVED } };
  //       // if (profileId) {
  //       //   match = { ...match, ...{ fromDistributorId: new mongoose.Types.ObjectId(profileId) } };
  //       // }

  //       if (user) {
  //         match = { ...match, ...{
  //           $and: [{$or: [{ fromDistributorId: new mongoose.Types.ObjectId(user.profileId) }, { toDistributorId: new mongoose.Types.ObjectId(user.profileId) }]}]
  //         }}
  //         console.log(match);
  //         if (dateFrom && dateTo) {
  //           if (new Date(dateFrom) <= new Date(dateTo)) {
  //             match = { ...match, ...{ salesOrderDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } } };
  //             // dateFrom = dateFrom;
  //             // dateTo = dateTo;
  //           } else {
  //             return {
  //               status: false,
  //               message: 'IDashBoardSummary.dateError',
  //               data: null,
  //               info: null,
  //               totalCount: null
  //             };
  //           }
  //         }
  //       }
  //      if (filter && filter != '') {
  //         let search = {
  //           $or: [
  //             { productName: { $regex: new RegExp(filter, "i") } },
  //             { toDistributorName: { $regex: new RegExp(filter, "i") } },
  //             { salesPersonName: { $regex: new RegExp(filter, "i") } },
  //             { salesOrderNumber: { $regex: new RegExp(filter, "i") } },
  //           ]
  //         };
  //         matchSearch = { ...matchSearch, ...search };
  //       }
  //       count = Number(count || 10);
  //       page = Number(page || 0);
  //       let result = await this.Module.aggregate([
  //         { $sort: { _id: 1 } },
  //         {
  //           $match: match
  //         },
  //         {
  //           $unwind: "$items"
  //         },
  //         {
  //           $match: matchSearch
  //         },
  //         {$group: {_id: {productName: "$items.productName", toDistributorId: "$toDistributorId", fromDistributorId: "$fromDistributorId"}, quantityTotal: {$sum: "$items.quantity"}}},
  //         {$project: {_id:0, productName: "$_id.productName", totalQuantity: "$quantityTotal", fromDistributorId: "$_id.fromDistributorId", toDistributorId: "$_id.toDistributorId"}},
  //         {
  //           $addFields: {
  //             "value": {
  //               "$cond": [
  //                 {
  //                   "$eq": ["$fromDistributorId", new mongoose.Types.ObjectId(user.profileId)]
  //                 },
  //                 {
  //                   "$multiply": [-1, "$totalQuantity"]
  //                 },
  //                 "$totalQuantity"
  //               ],
  //             },
  //           },
  //         },
  //         {$group: {_id: {productName: "$productName"}, quantityNet: {$sum: "$value"}}},
  //         // { $skip: page * count },
  //         // { $limit: count },
  //         {$project: {_id:0, productName: "$_id.productName", quantityNet: "$quantityNet"}},

  //       ]);

  //       if (result && result.length > 0) {
  //         return {
  //           status: true,
  //           message: IIptMessage.foundSuccess,
  //           data: result,
  //           // totalCount: result[0].totalCount[0].count,
  //         };
  //       } else {
  //         return {
  //           status: false,
  //           message: IIptMessage.notFound,
  //           data: null,
  //           // totalCount: 0,
  //         };
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
