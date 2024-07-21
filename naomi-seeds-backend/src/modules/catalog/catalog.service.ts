import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Catalog } from './catalog.interface';
import { CreateCatalogDto, UpdateCatalogDto, CatalogfindOneByIdRes, ICatalogMessage, ICatalogfindManyRes, ICatalogfindManyDropDownRes } from './catalog.dto';
import { IModuleRes } from '../../common.service';
import { FIND_MANY_PROJECTION_LIST } from './catalog.projection';

@Injectable()
export class CatalogService {
  constructor(@InjectModel('Catalog') private readonly Module: Model<Catalog>,
  ) {

  }

  async createModule(CatalogDto: CreateCatalogDto): Promise<IModuleRes> {
    try {
      const createCatalog = new this.Module(CatalogDto);
      await createCatalog.save();
      return { status: true, message: ICatalogMessage.createdSuccess }
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

  async updateModule(_id: string, catalogDto: UpdateCatalogDto): Promise<IModuleRes> {
    try {
      let result = await this.Module.updateOne({ _id: _id }, { $set: catalogDto });
      return { status: true, message: ICatalogMessage.updateSuccess }
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

  async deleteModule(_id: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: _id });
      return { status: true, message: ICatalogMessage.deleteSuccess }
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<CatalogfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {
        return { status: true, message: ICatalogMessage.foundSuccess, data: result }
      } else {
        return { status: false, message: ICatalogMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }



  async findManyModule(
    page: number,
    count: number,
    filter?: string,
    cropId?: any,
    status?: boolean
  ): Promise<ICatalogfindManyRes> {
    try {
      let project: any;
      project = FIND_MANY_PROJECTION_LIST;
      let match = {};
      if (cropId) {
        match = { ...match, ...{ cropId: new mongoose.Types.ObjectId(cropId) } };
      }
      count = Number(count || 10);
      page = Number(page || 0);
      let totalCount: any = [{ $count: 'count' }];
      let item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
        { $project: project }
      ]
      if (filter && filter != '') {
        let search = {
          $or: [{
            name: { $regex: new RegExp(filter, "i") }
          },
          { cropName: { $regex: new RegExp(filter, "i") } }]
        };
        match = { ...match, ...search };
      }
      if (status != undefined && status != null && typeof status === "boolean") {
        match = { ...match, ...{ status: status } };
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
        },
      ]);
      if (result && result[0].item.length > 0) {
        return {
          status: true,
          message: ICatalogMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: ICatalogMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }



  async findAllCatalogDropDown(
    status?: boolean
  ): Promise<ICatalogfindManyDropDownRes> {
    try {
      let aggregate: any[] = [];
      let match = {};
      if (status) {
        match = { ...match, ...{ status: status } };
      }
      if (match) {
        aggregate.push({ $match: match });
      }
      let project = {};
        project = { _id: 1, name: 1, crop: 1 }
      aggregate.push({ $project: project });
      let result = await this.Module.aggregate(aggregate);     
      if (result && result.length > 0) {
        return {
          status: true,
          message: ICatalogMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: ICatalogMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // async addLotData(_id: string, inventoryDetails: InventoryItemDetail): Promise<IModuleRes> {
  //   try {
  //     let result = await this.Module.updateOne({_id: _id}, {$push: {inventoryDetails: [inventoryDetails]}});
  //     return {status: true, message: ICatalogMessage.updateSuccess}
  //   } catch (error) {
  //     if (error.code && error.code == 11000) {
  //       let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //       let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //       throw new HttpException(
  //         DuplicateArrayToString + ' Already Exist',
  //         HttpStatus.CONFLICT,
  //       );
  //     } else {
  //        throw error;
  //     }
  //   }
  // }


  // async updateLotData(_id: string, lotId: string, inventoryDetails: InventoryItemDetail): Promise<IModuleRes> {
  //   try {
  //     let result = await this.Module.update({_id: _id}, {$set: {"inventoryDetails.$[elemX]": inventoryDetails}}, { "arrayFilters": [ {"elemX._id": lotId}]});
  //     return {status: true, message: ICatalogMessage.updateSuccess}
  //   } catch (error) {
  //     if (error.code && error.code == 11000) {
  //       let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //       let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //       throw new HttpException(
  //         DuplicateArrayToString + ' Already Exist',
  //         HttpStatus.CONFLICT,
  //       );
  //     } else {
  //        throw error;
  //     }
  //   }
  // }

  // async updateLotData(lotId: string, inventoryDetails: InventoryItemDetail): Promise<IModuleRes> {
  //   try {
  //     let result = await this.Module.update({"inventoryDetails._id": lotId }, {$set: {"inventoryDetails.$[elemX]": inventoryDetails}}, { "arrayFilters": [ {"elemX._id": lotId}]});
  //     return {status: true, message: ICatalogMessage.updateSuccess}
  //   } catch (error) {
  //     if (error.code && error.code == 11000) {
  //       let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //       let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //       throw new HttpException(
  //         DuplicateArrayToString + ' Already Exist',
  //         HttpStatus.CONFLICT,
  //       );
  //     } else {
  //        throw error;
  //     }
  //   }
  // }

  // async findLotData(lotId: string) {
  //   try {
  //     let result = await this.Module.find({"inventoryDetails._id": lotId }, {"name":1, "inventoryDetails.$": 1 })
  //     if (result) {
  //       return {status: true, message: ICatalogMessage.foundSuccess, data: result}
  //     } else {
  //       return {status: false, message: ICatalogMessage.notFound, data: null}
  //     }
  //   } catch (error) {
  //        throw error;
  //   }
  // }









}
