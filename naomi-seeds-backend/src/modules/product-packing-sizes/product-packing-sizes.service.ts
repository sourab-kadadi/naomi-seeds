import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePackingSizesDto, IProductPackingSizeMessage, IProductPackingSizesDropDownRes, IProductPackingSizesfindManyRes, ProductPackingSizesfindOneByIdRes, UpdatePackingSizesDto } from './product-packing-sizes.dto';
import { IModuleRes } from '../../common.service';
import { ProductPackingSizes } from './product-packing-sizes.interface';
import { productPackingSizes } from './product-packing-sizes.schema';


@Injectable()
export class ProductPackingSizesService {

    constructor(@InjectModel('ProductPackingSizes') private readonly Module: Model<ProductPackingSizes>,
    ) {
  
    }
  
    async createModule(createPackingSizesDto: CreatePackingSizesDto): Promise<IModuleRes> {
      try {
        const createPackingSize = new this.Module(createPackingSizesDto);
        await createPackingSize.save();
        return { status: true, message: IProductPackingSizeMessage.createdSuccess }
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
  
    async updateModule(_id: string, updatePackingSizesDto: UpdatePackingSizesDto): Promise<IModuleRes> {
      try {
        let result = await this.Module.updateOne({ _id: _id }, { $set: updatePackingSizesDto });
        return { status: true, message: IProductPackingSizeMessage.updateSuccess }
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
        return { status: true, message: IProductPackingSizeMessage.deleteSuccess }
      } catch (error) {
        throw error;
      }
    }
  
    async findOneModule(_id: string): Promise<ProductPackingSizesfindOneByIdRes> {
      try {
        let result = await this.Module.findOne({ _id: _id });
        if (result) {
          return { status: true, message: IProductPackingSizeMessage.foundSuccess, data: result }
        } else {
          return { status: false, message: IProductPackingSizeMessage.notFound, data: null }
        }
      } catch (error) {
        throw error;
      }
    }
  
  
  
    async findManyModule(
      productId: any,
      status?: boolean
    ): Promise<IProductPackingSizesfindManyRes> {
      try {
        // let project: any;
        // project = FIND_MANY_PROJECTION_LIST;
        let match = {};
        if (productId) {
          match = { ...match, ...{ productId: new mongoose.Types.ObjectId(productId) } };
        }
        let totalCount: any = [{ $count: 'count' }];
        let item: any = [
          // { $project: project }
        ]
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
            message: IProductPackingSizeMessage.foundSuccess,
            data: result[0].item,
            totalCount: result[0].totalCount[0].count,
          };
        } else {
          return {
            status: false,
            message: IProductPackingSizeMessage.notFound,
            data: null,
            totalCount: 0,
          };
        }
      } catch (error) {
        throw error;
      }
    }
  
  
    async findAllDropDown(
      productId: any,
      status?: boolean
    ): Promise<IProductPackingSizesDropDownRes> {
      try {
        let aggregate: any[] = [];
        let match = {};
        if (productId) {
          match = { ...match,  productId: new mongoose.Types.ObjectId(productId) };
        }  
        if (status) {
          match = { ...match, ...{ status: status } };
        }
        if (match) {
          aggregate.push({ $match: match });
        }
        aggregate.push({ $project: { lockedForEditingExceptAdmin: 0 } });     
        let result = await this.Module.aggregate(aggregate);

        if (result && result.length > 0 ) {
          return {
            status: true,
            message: IProductPackingSizeMessage.foundSuccess,
            data: result,
          };
        } else {
          return {
            status: false,
            message: IProductPackingSizeMessage.notFound,
            data: null,
          };
        }
      } catch (error) {
        throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
  
  }
  