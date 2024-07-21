import { Model } from 'mongoose';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IModuleRes } from '../../common.service';
// import { ApprovalStatus, IPT } from './ipt.interface';
import { ORDER } from './orders.interface';
import {
  FromProfileApproval,
  ILastPriceFetchMessage,
  IOrderMessage,
  IOrderfindManyRes,
  IOrderfindOneByIdRes,
  ManagerApprovalGenerateDC,
  ManagerFinalApproval,
  ToProfileConfirmation,
  TypeOfSale,
} from './orders.dto';

// import { InvoiceType, ItemDetail } from '../invoice/invoice.interface';

import * as mongoose from 'mongoose';

import { ProfileService } from '../profile/profile.service';
import { CatalogService } from '../catalog/catalog.service';
import { LotDataService } from '../lot-data/lot-data.service';
import { PdfServiceService } from '../pdf-service/pdf-service.service';
import * as hexgen from 'hex-generator';
import { ToWords } from 'to-words';
import { LedgerService } from '../ledger/ledger.service';
import {
  ACCOUNTINGTYPE,
  createLedgerStatementDto,
  PARTICULARTYPE,
} from '../ledger/ledger.dto';
import { RoleUpdated } from '../users/user-role.enum';
import { UserService } from '../users/user.service';
import { ProfileRole } from '../profile/profile-role.enum';
import { OrderStatus } from './orders.enum';
import { ORDERS_FIND_MANY_PROJECTION_LIST } from './orders.projection';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders') private readonly Module: Model<ORDER>,

    private profileService: ProfileService,
    private catalogService: CatalogService,
    private lotDataService: LotDataService,
    private readonly pdfService: PdfServiceService,
    private ledgerService: LedgerService,
    private userService: UserService,
  ) { }

  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  // create module order 
  async createModuleOrder(
    createOrderDto: any,
    user: any,
    // typeOfSale: string
  ): Promise<IModuleRes> {
    try {
      const lastSavedDoc = await this.Module.find({})
        .sort({ _id: -1 })
        .limit(1);
      if (lastSavedDoc && lastSavedDoc.length && lastSavedDoc[0].orderNumber) {
        const newOrderNumber =
          Number(lastSavedDoc[0]['orderNumber'].split('-')[2]) + 1;
        createOrderDto['orderNumber'] = 'NS-TXN-' + String(newOrderNumber);
      } else {
        const newOrderNumber = 1;
        createOrderDto['orderNumber'] = 'NS-TXN-' + String(newOrderNumber);
      }
      if (
        Number(createOrderDto.freightTotal) <
        Number(createOrderDto.frightPaidAdvance)
      ) {
        return { status: false, message: IOrderMessage.freightValidation };
      } else {
        createOrderDto['frightToPay'] =
          Number(createOrderDto.freightTotal) -
          Number(createOrderDto.frightPaidAdvance);
      }
      //   if (createOrderDto.fromDistributorId === createOrderDto.toDistributorId) {
      //     return { status: false, message: IIptValidationMessage.fromToDistributorError }
      //  }
      createOrderDto.createdByUserId = user.userId;
      createOrderDto.createdByUserName = `${user.firstName} ${user.lastName}`;
      // createOrderDto.typeOfSale = typeOfSale;
      if (createOrderDto.orderType.includes(TypeOfSale.COMPANY_SALE)) {
        createOrderDto.orderFromProfileRole = ProfileRole.COMPANY;
        createOrderDto.orderToProfileRole = ProfileRole.DISTRIBUTOR;
        const getFromProfileInfoTxn = await this.profileService.findCompanyModule(ProfileRole.COMPANY);
        createOrderDto.orderFromProfileId = getFromProfileInfoTxn.data._id;
        createOrderDto.orderFromProfileName = getFromProfileInfoTxn.data.companyName;
        createOrderDto.fromProfileApproval = FromProfileApproval.APPROVED;
        const getToProfileInfoTxn =
          await this.profileService.findOneModuleByProfileId(createOrderDto.orderToProfileId);
        createOrderDto.toProfileInfoTxn = {
          gstin: getToProfileInfoTxn.data.gstin,
          // email: getToProfileInfoTxn.data.userId.email,
          // phoneNo: getToProfileInfoTxn.data.userId.phoneNo,
          completeAddress: getToProfileInfoTxn.data.completeAddress,
          address1: getToProfileInfoTxn.data.addressDetails.address1,
          city: getToProfileInfoTxn.data.addressDetails.city,
          taluka: getToProfileInfoTxn.data.addressDetails.taluka,
          district: getToProfileInfoTxn.data.addressDetails.district,
          state: getToProfileInfoTxn.data.addressDetails.state,
          pincode: getToProfileInfoTxn.data.addressDetails.pincode,
        };
      } else if (createOrderDto.orderType.includes(TypeOfSale.IPT)) {
        createOrderDto.orderFromProfileRole = ProfileRole.DISTRIBUTOR;
        createOrderDto.orderToProfileRole = ProfileRole.DISTRIBUTOR;
        const getFromProfileInfoTxn = await this.profileService.findOneModuleByProfileId(createOrderDto.orderFromProfileId);
        createOrderDto.fromProfileInfoTxn = {
          gstin: getFromProfileInfoTxn.data?.gstin,
          // email: getFromProfileInfoTxn.data.userId.email,
          // phoneNo: getFromProfileInfoTxn.data.userId.phoneNo,
          completeAddress: getFromProfileInfoTxn.data.completeAddress,
          address1: getFromProfileInfoTxn.data.addressDetails.address1,
          city: getFromProfileInfoTxn.data.addressDetails.city,
          taluka: getFromProfileInfoTxn.data.addressDetails.taluka,
          district: getFromProfileInfoTxn.data.addressDetails.district,
          state: getFromProfileInfoTxn.data.addressDetails.state,
          pincode: getFromProfileInfoTxn.data.addressDetails.pincode,
        };

        // createOrderDto.fromProfileApproval = FromProfileApproval.APPROVED;
        const getToProfileInfoTxn =
          await this.profileService.findOneModuleByProfileId(createOrderDto.orderToProfileId);
        createOrderDto.toProfileInfoTxn = {
          gstin: getToProfileInfoTxn.data.gstin,
          // email: getToProfileInfoTxn.data.userId.email,
          // phoneNo: getToProfileInfoTxn.data.userId.phoneNo,
          completeAddress: getToProfileInfoTxn.data.completeAddress,
          address1: getToProfileInfoTxn.data.addressDetails.address1,
          city: getToProfileInfoTxn.data.addressDetails.city,
          taluka: getToProfileInfoTxn.data.addressDetails.taluka,
          district: getToProfileInfoTxn.data.addressDetails.district,
          state: getToProfileInfoTxn.data.addressDetails.state,
          pincode: getToProfileInfoTxn.data.addressDetails.pincode,
        };
      } else if (createOrderDto.orderType.includes(TypeOfSale.SALES_RETURN)) {

        createOrderDto.orderFromProfileRole = ProfileRole.DISTRIBUTOR;
        createOrderDto.orderToProfileRole = ProfileRole.COMPANY;
        const getToProfileInfoTxn = await this.profileService.findCompanyModule(ProfileRole.COMPANY);
        createOrderDto.orderToProfileId = getToProfileInfoTxn.data._id;
        createOrderDto.orderToProfileName = getToProfileInfoTxn.data.companyName;
        // createOrderDto.fromProfileApproval = FromProfileApproval.APPROVED;
        const getFromProfileInfoTxn = await this.profileService.findOneModuleByProfileId(createOrderDto.orderFromProfileId);
        createOrderDto.fromProfileInfoTxn = {
          gstin: getFromProfileInfoTxn.data.gstin,
          // email: getFromProfileInfoTxn.data.userId.email,
          // phoneNo: getFromProfileInfoTxn.data.userId.phoneNo,
          completeAddress: getFromProfileInfoTxn.data.completeAddress,
          address1: getFromProfileInfoTxn.data.addressDetails.address1,
          city: getFromProfileInfoTxn.data.addressDetails.city,
          taluka: getFromProfileInfoTxn.data.addressDetails.taluka,
          district: getFromProfileInfoTxn.data.addressDetails.district,
          state: getFromProfileInfoTxn.data.addressDetails.state,
          pincode: getFromProfileInfoTxn.data.addressDetails.pincode,
        };
      }
      const createOrder = new this.Module(createOrderDto);
      await createOrder.save();
      return { status: true, message: IOrderMessage.createdSuccess };
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

  async findOneModuleGen(_id: string): Promise<any> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {

        return { status: true, message: IOrderMessage.foundSuccess, data: result }
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }

  // this functions checks if the user has the access the document and only then returns it
  async findOneModule(
    _id: any,
    userId: any,
    userRole: string,
    userLinkToProfileId: string,
  ): Promise<IOrderfindOneByIdRes> {
    try {
      const openAccessRoles = [
        RoleUpdated.ADMIN,
        RoleUpdated.ACCOUNTANT,
        RoleUpdated.DIRECTOR,
        RoleUpdated.OPERATIONAL_MANAGER,
        RoleUpdated.PLANT_MANAGER,
      ];
      const result = await this.Module.findOne({
        _id: new mongoose.Types.ObjectId(_id),
      }).populate([
        {
          path: 'orderFromProfileId',
          model: 'Profile',
          select: 'firstLevelReportingUserID secondLevelReportingUserID',
        },
        {
          path: 'orderToProfileId',
          model: 'Profile',
          select: 'firstLevelReportingUserID secondLevelReportingUserID',
        },
      ]);
      if (result) {
        if (openAccessRoles.some((role) => userRole.includes(role))) {
          return {
            status: true,
            message: IOrderMessage.foundSuccess,
            data: result,
          };
        } else if (
          userRole.includes(RoleUpdated.SALES_OFFICER) &&
          result.orderToProfileId &&
          result.orderFromProfileId &&
          (result.orderToProfileId.firstLevelReportingUserID.toString() ===
            userId ||
            result.orderFromProfileId.firstLevelReportingUserID.toString() ===
            userId)
        ) {
          return {
            status: true,
            message: IOrderMessage.foundSuccess,
            data: result,
          };
        } else if (
          userRole.includes(RoleUpdated.MANAGER) &&
          result.orderToProfileId &&
          result.orderFromProfileId &&
          (result.orderToProfileId.secondLevelReportingUserID.toString() ===
            userId ||
            result.orderFromProfileId.secondLevelReportingUserID.toString() ===
            userId)
        ) {
          return {
            status: true,
            message: IOrderMessage.foundSuccess,
            data: result,
          };
        } else if (
          userRole.includes(RoleUpdated.DISTRIBUTOR) &&
          (result.orderToProfileId._id.toString() ===
            userLinkToProfileId.toString() ||
            result.orderFromProfileId._id.toString() ===
            userLinkToProfileId.toString())
        ) {
          return {
            status: true,
            message: IOrderMessage.foundSuccess,
            data: result,
          };
        } else {
          return {
            status: false,
            message: IOrderMessage.failedUnauthorisedAccessFind,
            data: null,
          };
        }
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }

  //     check all sales orders for plant manager, operational manager, director, admin, accountant
  async findManyModuleAll(
    userId: any,
    userRole: string,
    userLinkToProfileId: any,
    page: number,
    count: number,
    filter?: string,
    // status?: boolean,
    selectedDistributorProfileId?: any,
    // fromProfileApproval?: string,
    // managerApprovalGenerateDC?: string,
    // salesOfficerApprovalStatus?: string,
    // toProfileConfirmation?: string,
    managerFinalApproval?: string,
    pendingApprovalMyEnd?: boolean,
    orderType?: string,
    dateFrom?: Date,
    dateTo?: Date,
    // orderInProcess?: boolean,
    // completedOrders?: boolean,
  ): Promise<IOrderfindManyRes> {
    try {
      let match: any = {};
      let selectedDistributorProfilesArray: any = [];
      if (userRole.includes(RoleUpdated.SALES_OFFICER) || userRole.includes(RoleUpdated.MANAGER)) {
        const selectedDistributorProfiles =
          await this.profileService.findAllDropDownForAllotedDistributors(
            userId,
            userRole,
          );
        if (selectedDistributorProfiles.status === false) {
          return {
            status: false,
            message: IOrderMessage.notFound,
            data: null,
            totalCount: 0,
          };
        }
        selectedDistributorProfilesArray = selectedDistributorProfiles['data'].map((obj) => obj._id);
        if (selectedDistributorProfilesArray) {
          const orConditions = [
            { orderFromProfileId: { $in: selectedDistributorProfilesArray } },
            { orderToProfileId: { $in: selectedDistributorProfilesArray } },
          ];
          match = { ...match, $or: orConditions };
        }
      } else if (userRole.includes(RoleUpdated.DISTRIBUTOR)) {
        const orConditions = [
          { orderFromProfileId: new mongoose.Types.ObjectId(userLinkToProfileId) },
          { orderToProfileId: new mongoose.Types.ObjectId(userLinkToProfileId) },
        ];
        match = { ...match, $or: orConditions };
      }
      if (selectedDistributorProfileId) {

        const orConditions = [
          {
            orderFromProfileId: new mongoose.Types.ObjectId(selectedDistributorProfileId),
          },
          {
            orderToProfileId: new mongoose.Types.ObjectId(selectedDistributorProfileId),
          },
        ];
        match = { ...match, $or: orConditions };
      }


      if (pendingApprovalMyEnd) {
        if (userRole.includes(RoleUpdated.DISTRIBUTOR)) {

          const orConditions = [
            { fromProfileApproval: OrderStatus.PENDING },
            { toProfileConfirmation: OrderStatus.PENDING },
          ];
          match = { ...match, $or: orConditions };
        }
      } else if (userRole.includes(RoleUpdated.SALES_OFFICER)) {
        match = {
          ...match,
          ...{ salesOfficerApprovalStatus: OrderStatus.PENDING },
        };
      } else if (userRole.includes(RoleUpdated.MANAGER)) {
        const orConditions = [
          { managerApprovalGenerateDC: OrderStatus.PENDING },
          { managerFinalApproval: OrderStatus.PENDING },
        ];
        match = { ...match, $or: orConditions };
      }

      if (managerFinalApproval) {
        match = { ...match, ...{ managerFinalApproval: managerFinalApproval } };
      }

      if (orderType) {
        match = { ...match, ...{ orderType: orderType } };
      }

      if (dateFrom && dateTo) {
        if (new Date(dateFrom) <= new Date(dateTo)) {
          match = {
            ...match,
            ...{
              orderDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
            },
          };
        } else {
          return {
            status: false,
            message: IOrderMessage.dateError,
            data: null,
            totalCount: null,
          };
        }
      }

      count = Number(count || 10);
      page = Number(page || 0);
      const totalCount: any = [{ $count: 'count' }];
      const item: any = [
        { $sort: { _id: -1 } },
        { $skip: page * count },
        { $limit: count },
        { $project: ORDERS_FIND_MANY_PROJECTION_LIST },
      ];
      // if (filter && filter != '') {
      //   let search = {
      //     $or: [
      //       { fromDistributorName: { $regex: new RegExp(filter, "i") } },
      //       { toDistributorName: { $regex: new RegExp(filter, "i") } },
      //       { salesPersonName: { $regex: new RegExp(filter, "i") } },
      //       { managerName: { $regex: new RegExp(filter, "i") } },
      //       { salesOrderNumber: { $regex: new RegExp(filter, "i") } },
      //     ]
      //   };
      //   match = { ...match, ...search };
      // }
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
          message: IOrderMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IOrderMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }








  // this functions checks if the user has the access the document and only then returns it
  async findPreviousSalePriceOfLot(
    lotId: any,
    distributorId: any
  ): Promise<any> {
    // ): Promise<IOrderfindOneByIdRes> {
    try {
      const aggregatedData = await this.Module.aggregate([
        {
          $match: {
            orderToProfileId: new mongoose.Types.ObjectId(distributorId)
          }
        },
        {
          $unwind: "$items"
        },
        {
          $match: {
            "items.lotId": new mongoose.Types.ObjectId(lotId)
          }
        }
      ])
      let firstPrice = null;
      let samePrice = true;
      let previousSalesPricingData: any = {
        // effectiveRatePerKgForSale: 0,
        packetInvoicePriceForSale: 0
      }

      aggregatedData.forEach(doc => {
        const item = doc.items;
        if (item.lotId.toString() === lotId.toString()) {
          if (item && item.packetInvoicePriceForSale) {
            previousSalesPricingData.effectiveRatePerKgForSale = item.effectiveRatePerKgForSale;
            previousSalesPricingData.packetInvoicePriceForSale = item.packetInvoicePriceForSale;
            if (firstPrice === null) {
              firstPrice = item.packetInvoicePriceForSale;
            } else if (item.packetInvoicePriceForSale !== firstPrice) {
              samePrice = false;
            }
          } else {
            throw new Error("Price not found for lotId");
          }
        }
      });



      if (samePrice) {
        return {
          status: true,
          message: ILastPriceFetchMessage.priceFetchedSuccessfully,
          data: previousSalesPricingData,
        };
      } else {
        return { status: false, message: ILastPriceFetchMessage.priceIsDifferent, data: null };
        // throw new Error("Price is different the Sales Orders for the current Lot Id");

      }



      // if (result) {
      //     return {
      //       status: true,
      //       message: IOrderMessage.foundSuccess,
      //       data: 'previousSalesPricingData',
      //     };
      // } else {
      //   return { status: false, message: IOrderMessage.notFound, data: null };
      // }
    } catch (error) {
      throw error;
    }
  }


















  // IOrderfindOneByIdRes
  // approvals and rejects
  async fromProfileApprove(id: string): Promise<any> {
    try {
      let result = await this.Module.updateOne({ _id: id, fromProfileApproval: FromProfileApproval.PENDING }, { $set: { fromProfileApproval: FromProfileApproval.APPROVED } });
      if (result.modifiedCount === 1) {
        return { status: true, message: IOrderMessage.foundSuccess, data: result };
      } else if (result.modifiedCount > 1) {
        throw new Error('More than one document matched the criteria');
      } else if (result.modifiedCount === 0) {
        throw new Error('No document matched the criteria');
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }


  async fromProfileReject(id: string): Promise<any> {
    try {
      let result = await this.Module.updateOne({ _id: id, fromProfileApproval: FromProfileApproval.PENDING }, { $set: { fromProfileApproval: FromProfileApproval.REJECT } });
      if (result.modifiedCount === 1) {
        return { status: true, message: IOrderMessage.foundSuccess, data: result };
      } else if (result.modifiedCount > 1) {
        throw new Error('More than one document matched the criteria');
      } else if (result.modifiedCount === 0) {
        throw new Error('No document matched the criteria');
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }


  async managerApprovalDC(id: string): Promise<any> {
    try {
      let result = await this.Module.updateOne({ _id: id, managerApprovalGenerateDC: ManagerApprovalGenerateDC.PENDING }, { $set: { managerApprovalGenerateDC: ManagerApprovalGenerateDC.APPROVED } });
      if (result.modifiedCount === 1) {

        // const data = await this.findOneModuleGen(id)
// await this.createDeliveryChallanPdf(data.data)

        return { status: true, message: IOrderMessage.foundSuccess, data: result };
      } else if (result.modifiedCount > 1) {
        throw new Error('More than one document matched the criteria');
      } else if (result.modifiedCount === 0) {
        throw new Error('No document matched the criteria');
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }


  async managerRejectDC(id: string): Promise<any> {
    try {
      let result = await this.Module.updateOne({ _id: id, managerApprovalGenerateDC: ManagerApprovalGenerateDC.PENDING }, { $set: { managerApprovalGenerateDC: ManagerApprovalGenerateDC.REJECT } });
      if (result.modifiedCount === 1) {
        return { status: true, message: IOrderMessage.foundSuccess, data: result };
      } else if (result.modifiedCount > 1) {
        throw new Error('More than one document matched the criteria');
      } else if (result.modifiedCount === 0) {
        throw new Error('No document matched the criteria');
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }
  // sales officer not done and is set as approved by default

  async toProfileConfirmTxn(id: string): Promise<any> {
    try {
      let result = await this.Module.updateOne({ _id: id, toProfileConfirmation: ToProfileConfirmation.PENDING }, { $set: { toProfileConfirmation: ToProfileConfirmation.RECEIVED } });
      if (result.modifiedCount === 1) {
        return { status: true, message: IOrderMessage.foundSuccess, data: result };
      } else if (result.modifiedCount > 1) {
        throw new Error('More than one document matched the criteria');
      } else if (result.modifiedCount === 0) {
        throw new Error('No document matched the criteria');
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }


  async toProfileRejectTxn(id: string): Promise<any> {
    try {
      let result = await this.Module.updateOne({ _id: id, toProfileConfirmation: ToProfileConfirmation.PENDING }, { $set: { toProfileConfirmation: ToProfileConfirmation.REJECT } });
      if (result.modifiedCount === 1) {
        return { status: true, message: IOrderMessage.foundSuccess, data: result };
      } else if (result.modifiedCount > 1) {
        throw new Error('More than one document matched the criteria');
      } else if (result.modifiedCount === 0) {
        throw new Error('No document matched the criteria');
      } else {
        return { status: false, message: IOrderMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }

  // for company sale transaction approval
  async managerCompleteTxnSale(_id: string): Promise<any> {
    const ledgerSession = await this.ledgerService.Module.db.startSession();
    ledgerSession.startTransaction();
    try {
      const getOrderInfo = await this.Module.findOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING });
      const getCompanyInfo = await this.profileService.findCompanyModule(ProfileRole.COMPANY);
console.log(getOrderInfo, '11212')
      // const invoiceSalesObj = await this.geneRateInvoiceObj(getIptInfo, InvoiceType.INVOICE, getcompanyInfo);
      // const creditSalesObj = await this.geneRateCreditObj(getIptInfo, InvoiceType.CREDIT_NOTE, getcompanyInfo);

      // let invoiceRes = await this.createInvoicePdf(invoiceSalesObj);
      // let CreditRes = await this.createCreditPdf(creditSalesObj);

      let narration = `Sale from NSPL to ${getOrderInfo.orderToProfileName}`;

      const generateLedgerDebitOrder = await this.generateLedgerOrderDebitObj2(getOrderInfo, getCompanyInfo, PARTICULARTYPE.PURCHASES, narration);
      const generateLedgerCreditOrder = await this.generateLedgerOrderCreditObj2(getOrderInfo, getCompanyInfo, PARTICULARTYPE.SALES, narration);

      let ledgerDebit = await this.ledgerService.createModule(generateLedgerDebitOrder, ledgerSession);
      let ledgerCredit = await this.ledgerService.createModule(generateLedgerCreditOrder, ledgerSession);   
      
      let result = await this.Module.updateOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING },
        {
          $set: {
            managerFinalApproval: ManagerFinalApproval.APPROVED,
            // // invoiceId: invoiceModuleRes.data.invoiceId,
            // invoicePdfFileName: invoiceRes.data.invoicePdfFileName,
            // invoiceNumber: invoiceRes.data.invoiceNumber,
            ledgerCreditId: ledgerCredit.data._id,
            ledgerDebitId: ledgerDebit.data._id,
            // ledgerCreditIdIPTPart2: ledgerCreditRes2.data._id,
            // ledgerDebitIdIPTPart2: ledgerDebitRes2.data._id,
            // // creditNoteId: creditNoteModuleRes.data.creditNoteId,
            // creditNotePdfFileName: CreditRes.data.creditNotePdfFileName,
            // creditNoteNumber: CreditRes.data.creditNoteNumber,
          }
        });
      if (result) {
        await ledgerSession.commitTransaction();
        return { status: true, message: 'IIptMessage.ledgerSessionSuccess', data: null }
      } else {
        ledgerSession.abortTransaction();
        return { status: false, message: 'IIptMessage.ledgerSessionFailed', data: null }
      }
    } catch (error) {
      ledgerSession.abortTransaction();
      throw error;
    } finally {
      ledgerSession.endSession();
    }
  }


  // for Sales Return transaction approval
  async managerCompleteTxnSalesReturn(_id: string): Promise<any> {
    const ledgerSession = await this.ledgerService.Module.db.startSession();
    ledgerSession.startTransaction();
    try {
      const getOrderInfo = await this.Module.findOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING });
      const getCompanyInfo = await this.profileService.findCompanyModule(ProfileRole.COMPANY);
console.log(getOrderInfo, '11212')
      // const invoiceSalesObj = await this.geneRateInvoiceObj(getIptInfo, InvoiceType.INVOICE, getcompanyInfo);
      // const creditSalesObj = await this.geneRateCreditObj(getIptInfo, InvoiceType.CREDIT_NOTE, getcompanyInfo);

      // let invoiceRes = await this.createInvoicePdf(invoiceSalesObj);
      // let CreditRes = await this.createCreditPdf(creditSalesObj);

      let narration = `Return from ${getOrderInfo.orderFromProfileName} to NSPL`;
      const generateLedgerDebitOrder = await this.generateLedgerOrderDebitObj1(getOrderInfo, getCompanyInfo, PARTICULARTYPE.SALES_RETURN_TO_COMPANY, narration);
      const generateLedgerCreditOrder = await this.generateLedgerOrderCreditObj1(getOrderInfo, getCompanyInfo, PARTICULARTYPE.SALES_RETURN, narration);


      let ledgerDebit = await this.ledgerService.createModule(generateLedgerDebitOrder, ledgerSession);
      let ledgerCredit = await this.ledgerService.createModule(generateLedgerCreditOrder, ledgerSession);

      
      


      let result = await this.Module.updateOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING },
        {
          $set: {
            managerFinalApproval: ManagerFinalApproval.APPROVED,
            // // invoiceId: invoiceModuleRes.data.invoiceId,
            // invoicePdfFileName: invoiceRes.data.invoicePdfFileName,
            // invoiceNumber: invoiceRes.data.invoiceNumber,
            ledgerCreditId: ledgerCredit.data._id,
            ledgerDebitId: ledgerDebit.data._id,
            // ledgerCreditIdIPTPart2: ledgerCreditRes2.data._id,
            // ledgerDebitIdIPTPart2: ledgerDebitRes2.data._id,
            // // creditNoteId: creditNoteModuleRes.data.creditNoteId,
            // creditNotePdfFileName: CreditRes.data.creditNotePdfFileName,
            // creditNoteNumber: CreditRes.data.creditNoteNumber,
          }
        });
      if (result) {
        await ledgerSession.commitTransaction();
        return { status: true, message: 'IIptMessage.ledgerSessionSuccess', data: null }
      } else {
        ledgerSession.abortTransaction();
        return { status: false, message: 'IIptMessage.ledgerSessionFailed', data: null }
      }
    } catch (error) {
      ledgerSession.abortTransaction();
      throw error;
    } finally {
      ledgerSession.endSession();
    }
  }




  // for IPT complete transaction approval
  async managerCompleteTxnIPT(_id: string): Promise<any> {
    const ledgerSession = await this.ledgerService.Module.db.startSession();
    ledgerSession.startTransaction();
    try {
      const getOrderInfo = await this.Module.findOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING });
      const getCompanyInfo = await this.profileService.findCompanyModule(ProfileRole.COMPANY);
console.log(getOrderInfo, '11212')
      // const invoiceSalesObj = await this.geneRateInvoiceObj(getIptInfo, InvoiceType.INVOICE, getcompanyInfo);
      // const creditSalesObj = await this.geneRateCreditObj(getIptInfo, InvoiceType.CREDIT_NOTE, getcompanyInfo);

      // let invoiceRes = await this.createInvoicePdf(invoiceSalesObj);
      // let CreditRes = await this.createCreditPdf(creditSalesObj);

let narration = `IPT from ${getOrderInfo.orderFromProfileName} to ${getOrderInfo.orderToProfileName}`

      const generateLedgerDebitOrderPart1 = await this.generateLedgerOrderDebitObj1(getOrderInfo, getCompanyInfo, PARTICULARTYPE.IPT_SALES_RETURN, narration);
      const generateLedgerCreditOrderpart1 = await this.generateLedgerOrderCreditObj1(getOrderInfo, getCompanyInfo, PARTICULARTYPE.IPT_GOODS_TRANSFER, narration);
      const generateLedgerDebitOrderPart2 = await this.generateLedgerOrderDebitObj2(getOrderInfo, getCompanyInfo, PARTICULARTYPE.PURCHASES, narration);
      const generateLedgerCreditOrderPart2 = await this.generateLedgerOrderCreditObj2(getOrderInfo, getCompanyInfo, PARTICULARTYPE.IPT_SALES, narration);





console.log(generateLedgerCreditOrderPart2, 'generateLedgerCreditOrderPart2')
      let ledgerDebitRes1 = await this.ledgerService.createModule(generateLedgerDebitOrderPart1, ledgerSession);
      let ledgerCreditRes1 = await this.ledgerService.createModule(generateLedgerCreditOrderpart1, ledgerSession);
      let ledgerDebitRes2 = await this.ledgerService.createModule(generateLedgerDebitOrderPart2, ledgerSession);
      let ledgerCreditRes2 = await this.ledgerService.createModule(generateLedgerCreditOrderPart2, ledgerSession);
      
      


      let result = await this.Module.updateOne({ _id: _id, managerFinalApproval: ManagerFinalApproval.PENDING },
        {
          $set: {
            managerFinalApproval: ManagerFinalApproval.APPROVED,
            // // invoiceId: invoiceModuleRes.data.invoiceId,
            // invoicePdfFileName: invoiceRes.data.invoicePdfFileName,
            // invoiceNumber: invoiceRes.data.invoiceNumber,
            ledgerCreditId: ledgerCreditRes1.data._id,
            ledgerDebitId: ledgerDebitRes1.data._id,
            ledgerCreditIdIPTPart2: ledgerCreditRes2.data._id,
            ledgerDebitIdIPTPart2: ledgerDebitRes2.data._id,
            // // creditNoteId: creditNoteModuleRes.data.creditNoteId,
            // creditNotePdfFileName: CreditRes.data.creditNotePdfFileName,
            // creditNoteNumber: CreditRes.data.creditNoteNumber,
          }
        });
      if (result) {
        await ledgerSession.commitTransaction();
        return { status: true, message: 'IIptMessage.ledgerSessionSuccess', data: null }
      } else {
        ledgerSession.abortTransaction();
        return { status: false, message: 'IIptMessage.ledgerSessionFailed', data: null }
      }
    } catch (error) {
      ledgerSession.abortTransaction();
      throw error;
    } finally {
      ledgerSession.endSession();
    }
  }



  async generateLedgerOrderDebitObj1(orderDoc: any, getCompanyInfo: any, particularType: string, narration: any ): Promise<any> {
    // console.log(orderDoc, '1')
    let ledger: any = {
      partyProfileId: getCompanyInfo.data._id,
      partyName: getCompanyInfo.data.companyName,
      oppositePartyProfileId: orderDoc.orderFromProfileId,
      oppositePartyName: orderDoc.orderFromProfileName,
      txnRefId: orderDoc._id,
      txnRefCollection: "orders",
      txnDate: orderDoc.orderDate,
      accountingType: ACCOUNTINGTYPE.DR,
      particularType: particularType,
      amount: orderDoc.totalValueReturn,
      narration: narration
    };
    console.log(ledger, '2')
    return ledger;
  }


  async generateLedgerOrderCreditObj1(orderDoc: any, getCompanyInfo: any, particularType: string, narration: any): Promise<any> {
    let ledger: createLedgerStatementDto = {
      partyProfileId: orderDoc.orderFromProfileId,
      partyName: orderDoc.orderFromProfileName,
      oppositePartyProfileId: getCompanyInfo.data._id,
      oppositePartyName: getCompanyInfo.data.companyName,
      txnRefId: orderDoc._id,
      txnRefCollection: "orders",
      txnDate: orderDoc.orderDate,
      accountingType: ACCOUNTINGTYPE.CR,
      particularType: particularType,
      amount: orderDoc.totalValueReturn,
      narration: narration
    };
    return ledger;
  }
   
  async generateLedgerOrderDebitObj2(orderDoc: any, getCompanyInfo: any, particularType: string, narration: any): Promise<any> {
    console.log('2')
      let ledger: createLedgerStatementDto = {
        partyProfileId: orderDoc.orderToProfileId,
        partyName: orderDoc.orderToProfileName,
        oppositePartyProfileId: getCompanyInfo.data._id,
        oppositePartyName: getCompanyInfo.data.companyName,
        txnRefId: orderDoc._id,
        txnRefCollection: "orders",
        txnDate: orderDoc.orderDate,
        accountingType: ACCOUNTINGTYPE.DR,
        particularType: particularType,
        amount: orderDoc.totalValueSale,
        narration: narration
      };
      return ledger;
    }

    async generateLedgerOrderCreditObj2(orderDoc: any, getCompanyInfo: any, particularType: string, narration: any): Promise<any> {
      let ledger: createLedgerStatementDto = {
        partyProfileId: getCompanyInfo.data._id,
        partyName: getCompanyInfo.data.companyName,
        oppositePartyProfileId: orderDoc.orderToProfileId,
        oppositePartyName: orderDoc.orderToProfileName,
        txnRefId: orderDoc._id,
        txnRefCollection: "orders",
        txnDate: orderDoc.orderDate,
        accountingType: ACCOUNTINGTYPE.CR,
        particularType: particularType,
        amount: orderDoc.totalValueSale,
        narration: narration
      };
      return ledger;
    }
  
  
    async managerRejectFinalTxn(id: string): Promise<any> {
      try {
        let result = await this.Module.updateOne({ _id: id, managerFinalApproval: ManagerFinalApproval.PENDING }, { $set: { managerFinalApproval: ManagerFinalApproval.REJECT } });
        if (result.modifiedCount === 1) {
          return { status: true, message: IOrderMessage.foundSuccess, data: result };
        } else if (result.modifiedCount > 1) {
          throw new Error('More than one document matched the criteria');
        } else if (result.modifiedCount === 0) {
          throw new Error('No document matched the criteria');
        } else {
          return { status: false, message: IOrderMessage.notFound, data: null };
        }
      } catch (error) {
        throw error;
      }
    }
  
  
    async createDeliveryChallanPdf(orderDetails: any): Promise<any> {
      try {
        orderDetails.delivaryChallanNumber =  orderDetails.orderNumber.replace("TXN", "DC");
        orderDetails.dcPdfFileName = hexgen(128) + orderDetails.orderNumber + '.pdf';
  // console.log(orderDetails, 'orderDetails')
  // console.log('pdf file', orderDetails.dcPdfFileName)
  // delivery-challan
        const dataPdfService = await this.pdfService.generatePDFToS3('123', orderDetails.dcPdfFileName, {
          locals:
          {
            deliveryChallan: orderDetails,
            amountInWords: this.toWords.convert(orderDetails.totalValueSale),
          }
        });
  // console.log(dataPdfService, 'dataPdfService')
        // return {
        //   status: true, message: IDeliveryChallanMessage.createdSuccess, data: {
        //     delivaryChallanId: res._id,
        //     delivaryChallanNumber: res.dcNumber,
        //     dcPdfFileName: fileName,
        //   }
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
  
    
  
  
  }


