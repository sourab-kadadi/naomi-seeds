import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IModuleRes } from '../../common.service';
import { LotData } from './lot-data.interface';
import { CreateLotDataDtoInput, LotDatafindOneByIdRes, EItemStatus, ILotDataMessage, ILotDatafindManyRes, UploadLotData, ILotDatafindManyDropDownRes } from './lot-data.dto';
import { IRoleMessage, Role } from '../roles/roles.enum';
import { ProfileService } from '../profile/profile.service';
import { UserService } from '../users/user.service';
import { CatalogService } from '../catalog/catalog.service';
import { ProductPackingSizesService } from '../product-packing-sizes/product-packing-sizes.service';
import { LOT_DATA_FIND_MANY_PROJECTION_LIST } from './lot-data.projection';



@Injectable()
export class LotDataService {
  constructor(@InjectModel('LotData') private readonly Module: Model<LotData>,
    private profileService: ProfileService, private userService: UserService, private catalogService: CatalogService,
    private productPackingSizesService: ProductPackingSizesService
  ) { }

  async createModule(
    lotDataDto: CreateLotDataDtoInput,
    userId: string): Promise<IModuleRes> {
    try {
      const getProductInfo = await this.catalogService.findOneModule(lotDataDto.productId);
      const getProductPackingSizeInfo = await this.productPackingSizesService.findOneModule(lotDataDto.productPackingSizeId);
      lotDataDto.productName = getProductInfo.data.name;
      lotDataDto.cropId = getProductInfo.data.cropId;
      lotDataDto.cropName = getProductInfo.data.crop;
      lotDataDto.cropType = getProductInfo.data.cropType;
      lotDataDto.hsnCode = getProductInfo.data.hsnCode;
      lotDataDto['productData'] = {
        image: getProductInfo.data.image,
        morphologicalCharacters: getProductInfo.data.morphologicalCharacters,
        specialFeaturesUSPS: getProductInfo.data.specialFeaturesUSPS,
      };
      lotDataDto.truthfulLabel = getProductInfo.data.truthfulLabel;
      // lotDataDto.packingQty = getProductPackingSizeInfo.data.packingQty;
      // lotDataDto.packingUnit = getProductPackingSizeInfo.data.packingUnit;
      // lotDataDto.effectiveRatePerKg = getProductPackingSizeInfo.data.effectiveRatePerKg;
      // lotDataDto.packetInvoicePrice = getProductPackingSizeInfo.data.packetInvoicePrice;
      // lotDataDto.packetMRPPrice = getProductPackingSizeInfo.data.packetMRPPrice;
      const createLotData = new this.Module(lotDataDto);
      await createLotData.save();
      return { status: true, message: ILotDataMessage.createdSuccess }
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



  async updateModule(_id: string, lotDataDto: UploadLotData, profileId: string): Promise<IModuleRes> {
    try {
      let result = await this.Module.updateOne({ _id: _id }, { $set: lotDataDto });
      return { status: true, message: ILotDataMessage.updateSuccess }
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + ' Aleardy Exists',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

  async deleteModule(_id: string, profileId: string): Promise<IModuleRes> {
    try {
      const getUserProfileInfo = await this.profileService.findOneModule(profileId);
      if (getUserProfileInfo && getUserProfileInfo.status === true &&
        getUserProfileInfo.data.roles[0] === Role.ADMIN) {
        await this.Module.deleteOne({ _id: _id });
        return { status: true, message: ILotDataMessage.deleteSuccess }
      } else {
        return { status: false, message: ILotDataMessage.failedUnauthorisedAccessDelete }
      }
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<LotDatafindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      return { status: true, message: ILotDataMessage.foundSuccess, data: result }
    } catch (error) {
      throw error;
    }
  }

  async findOneExpanded(_id: string): Promise<LotDatafindOneByIdRes> {
    try {
      let result = await this.Module.aggregate([
        {
          // $match: { _id: new mongoose.Types.ObjectId('6330c48d1acef610f0909bb1') }
          $match: { _id: new mongoose.Types.ObjectId(_id) }
        },
        {
          $limit: 1
        },
        {
          $lookup: {
            from: "productpackingsizes",
            localField: "productPackingSizeId",
            foreignField: "_id",
            as: "productPackingSizeInfo"
          }
        },
        {
          $unwind: "$productPackingSizeInfo"
        }
      ])
      if (result && result[0]) {
        return {
          status: true,
          message: ILotDataMessage.foundSuccess,
          data: result[0],
        };
      } else {
        return {
          status: false,
          message: ILotDataMessage.notFound,
          data: null,
        };
      }
    

      // return { status: true, message: ILotDataMessage.foundSuccess, data: result[0] }
    } catch (error) {
      console.log(error, 'asdasd')
      throw error;
    }
  }



  async findManyModule(
    page: number,
    count: number,
    userId?: any,
    productId?: any,
    filter?: string,
    lotValidityAvailable?: boolean,
    lotDataEditable?: boolean
  ): Promise<ILotDatafindManyRes> {
    try {
      let match = {};
      if (productId) {
        match = { ...match, ...{ productId: new mongoose.Types.ObjectId(productId) } }
      }
      if (lotValidityAvailable) {
        match = { ...match, ...{ lotValidityAvailable: lotValidityAvailable } }
      }
      if (lotDataEditable) {
        match = { ...match, ...{ lotDataEditable: lotDataEditable } }
      }
      let project: any = LOT_DATA_FIND_MANY_PROJECTION_LIST;
      count = Number(count || 10);
      page = Number(page || 0);
      let totalCount: any = [{ $count: 'count' }];
      let item: any = [
        { $sort: { _id: -1 } },
        { $skip: page * count },
        { $limit: count },
        {
          $lookup: {
            from: "productpackingsizes",
            localField: "productPackingSizeId",
            foreignField: "_id",
            as: "productPackingSizeInfo"
          }
        },
        {
          $unwind: "$productPackingSizeInfo"
        },
        { $project: project }
      ]
      if (filter && filter != '') {
        let search = {
          $or: [
            { lotNo: { $regex: new RegExp(filter, "i") } },
            { productName: { $regex: new RegExp(filter, "i") } },
            { cropName: { $regex: new RegExp(filter, "i") } },
          ]
        };
        match = { ...match, ...search };
      }
      if (match ) {
        item.unshift({ $match: match });
        totalCount.unshift({ $match: match });
      }
      console.log(item)
      let result = await this.Module.aggregate([
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
          message: ILotDataMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: ILotDataMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }


  async findAllLotDropDown(
    productId: any,
    lotValidityAvailable?: boolean
  ): Promise<ILotDatafindManyDropDownRes> {
    try {
      let aggregate: any[] = [];
      let match = {};
      if (productId) {
        match = { ...match, ...{ productId: new mongoose.Types.ObjectId(productId) } };
      }
      if (lotValidityAvailable) {
        match = { ...match, ...{ lotValidityAvailable: lotValidityAvailable } };
      }
      if (match) {
        aggregate.push({ $match: match });
      }
      let project = {};
        project = { _id: 1, lotNo: 1 };
      aggregate.push({ $project: project });
      let result = await this.Module.aggregate(aggregate);     
      if (result && result.length > 0) {
        return {
          status: true,
          message: ILotDataMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: ILotDataMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
