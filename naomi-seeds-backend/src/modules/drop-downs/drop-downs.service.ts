import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DropDownsGeneral } from './drop-downs.interface';
import { CreateDropDownsGeneralDto, UpdateDropDownsGeneralDto, DropDownfindOneByIdRes, IMessage, IDropDownfindManyRes} from './drop-downs.dto';
import { IModuleRes } from '../../common.service';

@Injectable()
export class DropDownsService {
    constructor(@InjectModel('dropDownsGenerals') private readonly Module: Model<DropDownsGeneral>) {

    }

    async createModule(CreateDropDownsGeneralDto: CreateDropDownsGeneralDto):Promise<IModuleRes> {
        try {
          const create = new this.Module(CreateDropDownsGeneralDto);
          await create.save();
          return {status: true, message: IMessage.createdSuccess}
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

      async updateModule(_id: string, UpdateDropDownsGeneralDto: UpdateDropDownsGeneralDto): Promise<IModuleRes> {
        try {
          let result = await this.Module.updateOne({_id: _id}, {$set : UpdateDropDownsGeneralDto });
          return {status: true, message: IMessage.updateSuccess}
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

      async deleteModule(_id: string): Promise<IModuleRes> {
        try {
          await this.Module.deleteOne({_id: _id});
          return {status: true, message: IMessage.deleteSuccess}
        } catch (error) {
             throw error;
        }
      }

      async findOneModule(_id: string): Promise<DropDownfindOneByIdRes> {
        try {
          let result = await this.Module.findOne({_id: _id});
          if (result) {
            return {status: true, message: IMessage.foundSuccess, data: result}
          } else {
            return {status: false, message: IMessage.notFound, data: null}
          }
        } catch (error) {
             throw error;
        }
      }



      async findManyModule(
        dropDownFor: string,
        parentDropdownName?: string,
        filter?: string,
        status?: boolean
      ): Promise<IDropDownfindManyRes> {
        try {
          let match = {};
          let totalCount: any = [{ $count: 'count' }];
          let item: any = [
            { $sort: { _id: 1 } },
          ]
          if (dropDownFor) {
            match = { ...match, ...{dropDownFor: dropDownFor}};
          }
          if (parentDropdownName) {
            match = { ...match, ...{parentDropdownName: parentDropdownName}};
          }
         if (filter && filter != '') {
            let search = {
              $or: [{
                name: { $regex: new RegExp(filter, "i") }
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
              message: IMessage.foundSuccess,
              data: result[0].item,
              totalCount: result[0].totalCount[0].count,
            };
          } else {
            return {
              status: false,
              message: IMessage.notFound,
              data: null,
              totalCount: 0,
            };
          }
        } catch (error) {
           throw error;
        }
      }


      async findAllTest(): Promise<any> {
        try {
      const result = await this.Module.find();
      debugger
      if (result && result.length > 0) {
        return {
          status: true,
          message: 'foundSuccess',
          data: result,
        };
      } else {
        return {
          status: false,
          message: 'notFound',
          data: null,
        };
      }
        } catch (error) {
          throw new Error(`Error fetching data: ${error.message}`);
        }
      }
}
