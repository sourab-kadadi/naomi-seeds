import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IModuleRes } from '../../common.service';
import { IRoleMessage, Role } from '../roles/roles.enum';
import { ProfileService } from '../profile/profile.service';
import { CreateRequirementDto, DISPATCHEDSTATUS, IDashBoardSummary, IRequirementDatafindManyRes, IRequirementDataMessage } from './requirement.dto';
import { RequirementData } from './requirement.interface';


@Injectable()
export class RequirementService {

    constructor(@InjectModel('RequirementData') private readonly Module: Model<RequirementData>,
    private profileService: ProfileService,

  ) { }

    async createModule(
      requirementDto2: any, 
      profileId: string,
      userName: string
      ): Promise<IModuleRes> {
        try {
          const getUserProfileInfo = await this.profileService.findOneModule(profileId);
          if (getUserProfileInfo && getUserProfileInfo.status === true 
            // && getUserProfileInfo.data.roles[0] !== Role.DISTRIBUTOR
            ) {              
              

              if (getUserProfileInfo.data.roles[0] === Role.SALES_OFFICER) {
                requirementDto2['salesPersonId'] = profileId;
                requirementDto2['salesPersonName'] = userName;
              }

                let requirementDto1 = [];
                for (let i in requirementDto2.items) {
                    requirementDto1.push({
                        toDistributorId: requirementDto2.toDistributorId,
                        toDistributorName: requirementDto2.toDistributorName,
                        salesPersonId: requirementDto2.salesPersonId,
                        salesPersonName: requirementDto2.salesPersonName,
                        managerId: requirementDto2.managerId,
                        managerName: requirementDto2.managerName,
                        requirementDate: requirementDto2.requirementDate,
                        productId: requirementDto2.items[i].productId,
                        productName: requirementDto2.items[i].productName,
                        quantity: requirementDto2.items[i].quantity,
                        quantityUnit: requirementDto2.items[i].quantityUnit,
                        packingSize: requirementDto2.items[i].packingSize,
                        packingSizeunit: requirementDto2.items[i].packingSizeunit
                    })
                    }
            for (let i in requirementDto1) {
                const createRequirementData = new this.Module(requirementDto1[i]);
                await createRequirementData.save();
            }
            return { status: true, message: IRequirementDataMessage.createdSuccess }
          } else {
            return { status: false, message: IRequirementDataMessage.failedUnauthorisedAccessCreate }
          }
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
        profileId: string,
        userRole: string,
        salesPersonId?: string,
        managerId?: string,
        toDistributorId?: string,
        filter?: string,
        dispatchedStatus?: string,
        dateFrom?: Date, 
        dateTo?: Date
      ): Promise<
      any
      // IRequirementDatafindManyRes
      > {
        try {
          let match = {};
          if (userRole === Role.SALES_OFFICER) {
            match = { ...match, ...{ salesPersonId: new mongoose.Types.ObjectId(profileId) } }            
          } else if (userRole === Role.MANAGER) {
            match = { ...match, ...{ managerId: new mongoose.Types.ObjectId(profileId) } }            
          }
          if (dateFrom && dateTo) {
            if (new Date(dateFrom) <= new Date(dateTo)) {
              match = { ...match, ...{ requirementDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } } };
              // tempData.dateFrom = dateFrom;
              // tempData.dateTo = dateTo;
            } else {
              return {
                status: false,
                message: IDashBoardSummary.dateError,
                data: null,
                };
            }
    
          } 
            if (salesPersonId) {
              match = { ...match, ...{ salesPersonId: new mongoose.Types.ObjectId(salesPersonId) } }
            }
            if (managerId) {
              match = { ...match, ...{ managerId: new mongoose.Types.ObjectId(managerId) } }
            }
            if (toDistributorId) {
                match = { ...match, ...{ toDistributorId: new mongoose.Types.ObjectId(toDistributorId) } }
              }
            if (dispatchedStatus) {
              match = { ...match, ...{ dispatchedStatus: dispatchedStatus } }
            }
          count = Number(count || 10);
          page = Number(page || 0);
          let totalCount: any = [{ $count: 'count' }];
          let item: any = [

            {
              $group: {
                _id: "$toDistributorName",
                "itemDetails": { 
                  $push: {
                    requirementDate: "$requirementDate",
                    salesPersonName: "$salesPersonName",
                    managerName: "$managerName",
                    productName: "$productName",
                    quantity: "$quantity",
                    quantityUnit: "$quantityUnit",
                    packingSize: "$packingSize",
                    packingSizeunit: "$packingSizeunit",
                    dispatchedStatus: "$dispatchedStatus",
                  } 
                }
              },
            },
            {
              $project: {
                _id: 0,
                toDistributorName: "$_id",
                itemsDetails: "$itemDetails", 
            //     productName: true,
                // dateFrom: dateFrom,
                // dateTo: dateTo,
            //     // type: '$_id',
            //     // totalQuantity: '$totalQuantity',
              }
            },
            { $sort: { requirementDate: 1 } },
            { $skip: page * count },
            { $limit: count },
          ]
          // let totalCount: any = [{ $count: 'count' }];
          // console.log('totalCount', totalCount);
          // console.log(item);
          if (filter && filter != '') {
            let search = {
              $or: [
              { salesPersonName: { $regex: new RegExp(filter, "i") } },
              { managerName: { $regex: new RegExp(filter, "i") } },
              { toDistributorName: { $regex: new RegExp(filter, "i") } },
              { productName: { $regex: new RegExp(filter, "i") } }
              ]
            };
            match = { ...match, ...search };
          }
          if (match ) {
            item.unshift({ $match: match });
            totalCount.unshift({ $match: match });
          }
    
          let result = await this.Module.aggregate([
            {
              $facet: {
                item: item,
                totalCount: totalCount,
              },
            }
          ]);
    
          if (result && result[0].item.length > 0) {
            return {
              status: true,
              message: IRequirementDataMessage.foundSuccess,
              data: result[0].item,
              totalCount: result[0].totalCount[0].count,
            };
          } else {
            return {
              status: false,
              message: IRequirementDataMessage.notFound,
              data: null,
              totalCount: 0,
            };
          }
        } catch (error) {
          throw error;
        }
      }

    async dashboardSummaryTotalRequirement(
      page: number,
      count: number,
      profileId: string,
      filter?: string,
      // profileId: string,
      // dispatchedStatus?: string,
      // salesOfficerId?: string, 
      // managerId?: string, 
      // distributorId?: string, 
      dateFrom?: Date, 
      dateTo?: Date
    ): Promise<any> {
      try {
        let match = {};
        const dispatchedStatus = "PENDING";
        // const getUserProfileInfo = await this.profileService.findOneModule(profileId);
        // if (getUserProfileInfo && getUserProfileInfo.status === true 
          // && getUserProfileInfo.data.roles[0] !== Role.DISTRIBUTOR
          // ) {                      

        match = { ...match, ...{dispatchedStatus: dispatchedStatus  } };


        
        if (filter && filter != '') {
          let search = {
            $or: [
            // { salesPersonName: { $regex: new RegExp(filter, "i") } },
            // { managerName: { $regex: new RegExp(filter, "i") } },
            // { toDistributorName: { $regex: new RegExp(filter, "i") } },
            { productName: { $regex: new RegExp(filter, "i") } }
            ]
          };
          match = { ...match, ...search };
        }
        // if (profileId) {
        //   match = { ...match, ...{ toDistributorId: new mongoose.Types.ObjectId(profileId) } };
        // }
        if (dateFrom && dateTo) {
          if (new Date(dateFrom) <= new Date(dateTo)) {
            match = { ...match, ...{ requirementDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } } };
            // tempData.dateFrom = dateFrom;
            // tempData.dateTo = dateTo;
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
              _id: {productName: "$productName", packingSize: "$packingSize"},
              totalQuantity: { $sum: "$quantity" },
            
            },
          },
          {
            $project: {
              _id: 0,
              productName: '$_id.productName',
              packingSize: '$_id.packingSize',
              
              dateFrom: dateFrom,
              dateTo: dateTo,
              // type: '$_id',
              quantityUnit: "kgs",
              totalQuantity: '$totalQuantity',

            }
          },


          {
            '$sort': {
              'productName': 1
            }
          },
        ]);
        if (result && result.length > 0) {
  
  
          // if (result[0] && result[0].type === InvoiceType.CREDIT_NOTE) {
          //   creditNoteReceived = result[0].totalAmount;
          // } else if (result[1] && result[1].type === InvoiceType.CREDIT_NOTE) {
          //   creditNoteReceived = result[1].totalAmount;
          // } else {
          //   creditNoteReceived = 0;
          // }
          // if (result[0] && result[0].type === InvoiceType.INVOICE) {
          //   grossPurchases = result[0].totalAmount;
          // } else if (result[1] && result[1].type === InvoiceType.INVOICE) {
          //   grossPurchases = result[1].totalAmount;
          // } else {
          //   grossPurchases = 0;
          // }
  
          // netPurchases = grossPurchases - creditNoteReceived;
          // pendingPayable = netPurchases - paymentsMade - discountReceived;
         
  
  // tempData.grossPurchases = grossPurchases;
  // tempData.creditNoteReceived = creditNoteReceived;
  // tempData.netPurchases = netPurchases;
  // tempData.paymentsMade = paymentsMade;
  // tempData.discountReceived = discountReceived;
  // tempData.pendingPayable = pendingPayable;
  
  
  
          return {
            status: true,
            message: IDashBoardSummary.dashBoardSummarySuccess,
            data: result,
  
          };
        } 
        else {
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
