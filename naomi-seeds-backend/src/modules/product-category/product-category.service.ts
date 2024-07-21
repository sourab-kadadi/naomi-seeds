import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCategory } from './product-category.interface';
import {CreateProductCategoryDto, IProductCategoryDropDownRes, IProductCategoryfindManyRes, IProductCategoryMessage, ProductCategoryfindOneByIdRes, UpdateProductCategoryDto} from './product-category.dto';
import { IModuleRes } from '../../common.service';

@Injectable()
export class ProductCategoryService {
    constructor(@InjectModel('ProductCategory') private readonly Module: Model<ProductCategory>,
    ) {

    }

    async createModule(createProductCategoryDto: CreateProductCategoryDto):Promise<IModuleRes> {
        try {
          const createCatalog = new this.Module(createProductCategoryDto);
          await createCatalog.save();
          return {status: true, message: IProductCategoryMessage.createdSuccess}
        } catch (error) {
          if (error.code && error.code == 11000) {
            let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
            let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
            throw new HttpException(
              DuplicateArrayToString + ' Aleary Exist',
              HttpStatus.CONFLICT,
            );
          } else {
            throw error;
          }
        }
      }

      async updateModule(_id: string, updateProductCategoryDto: UpdateProductCategoryDto): Promise<IModuleRes> {
        try {
          let result = await this.Module.updateOne({_id: _id}, {$set : updateProductCategoryDto });
          return {status: true, message: IProductCategoryMessage.updateSuccess}
        } catch (error) {
          if (error.code && error.code == 11000) {
            let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
            let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
            throw new HttpException(
              DuplicateArrayToString + ' Aleary Exist',
              HttpStatus.CONFLICT,
            );
          } else {
             throw error;
          }
        }
      }

      // async deleteModule(_id: string): Promise<IModuleRes> {
      //   try {
      //     await this.Module.deleteOne({_id: _id});
      //     return {status: true, message: IProductCategoryMessage.deleteSuccess}
      //   } catch (error) {
      //        throw error;
      //   }
      // }

      async findOneModule(_id: string): Promise<ProductCategoryfindOneByIdRes> {
        try {
          let result = await this.Module.findOne({_id: _id});
          if (result) {
            return {status: true, message: IProductCategoryMessage.foundSuccess, data: result}
          } else {
            return {status: false, message: IProductCategoryMessage.notFound, data: null}
          }
        } catch (error) {
             throw error;
        }
      }



      async findManyModule(
        page: number,
        count: number,
        filter?: string,
        status?: boolean
      ): Promise<IProductCategoryfindManyRes> {
        try {
          let match = {};
          count = Number(count || 10);
          page = Number(page || 0);
          let totalCount: any = [{ $count: 'count' }];
          let item: any = [
            { $sort: { _id: 1 } },
            { $skip: page * count },
            { $limit: count },
          ]
          if (filter && filter != '') {
            let search = {
              $or: [{
                cropName: { $regex: new RegExp(filter, "i") }
              }]
            };
            match = { ...match, ...search};
          }
          if (status != undefined && status != null && typeof status === "boolean") {
            match = { ...match, ...{status: status}};
          }
          if(match ) {
            item.unshift({$match: match});
            totalCount.unshift({$match: match});
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
              message: IProductCategoryMessage.foundSuccess,
              data: result[0].item,
              totalCount: result[0].totalCount[0].count,
            };
          } else {
            return {
              status: false,
              message: IProductCategoryMessage.notFound,
              data: null,
              totalCount: 0,
            };
          }
        } catch (error) {
           throw error;
        }
      }


      async findAllProductCategoryDropDown(
        status?: boolean
      ): Promise<IProductCategoryDropDownRes> {
        try {
          let aggregate: any[] = [];
          // as/
          let match = {};
          if (status) {
            match = { ...match, ...{ status: status } };
          }
          if (match) {
            aggregate.push({ $match: match });
          }
          aggregate.push({ $project: { _id: 1, cropName: 1, cropType:1, status: 1  } });     
          let result = await this.Module.aggregate(aggregate);
          if (result && result.length > 0) {
            return {
              status: true,
              message: IProductCategoryMessage.foundSuccess,
              data: result,
            };
          } else {
            return {
              status: false,
              message: IProductCategoryMessage.notFound,
              data: null,
            };
          }
        } catch (error) {
          throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
    
    
    





}

