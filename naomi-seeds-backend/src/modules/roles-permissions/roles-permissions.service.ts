import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RolesPermissions, RolesSeniorityLevel } from './roles-permissions.interface';
import { CreateRolesPermissionsDto, UpdateRolesPermissionsDto, IRolesPermissionsDatafindOneByIdRes, IRolesPermissionsDatafindManyRes, IRolesPermissionsDataMessage, IRoleGroupsDatafindManyRes, IRolesSeniorityLevelDataRes } from './roles-permissions.dto';
import { IModuleRes } from '../../common.service';

@Injectable()
export class RolesPermissionsService {
  constructor(@InjectModel('RolesPermissions') private readonly Module: Model<RolesPermissions>,
  ) {

  }

  async createModule(rolesPermissionsDto: CreateRolesPermissionsDto): Promise<IModuleRes> {
    try {
      console.log(rolesPermissionsDto, '11createRolesPermissions')
      const createRolesPermissions = new this.Module(rolesPermissionsDto);
      console.log(createRolesPermissions, 'createRolesPermissions')
      await createRolesPermissions.save();
      return { status: true, message: IRolesPermissionsDataMessage.createdSuccess }
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

  async updateModule(_id: string, rolesPermissionsDto: UpdateRolesPermissionsDto): Promise<IModuleRes> {
    try {
      let result = await this.Module.updateOne({ _id: _id }, { $set: rolesPermissionsDto });
      return { status: true, message: IRolesPermissionsDataMessage.updateSuccess }
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
      return { status: true, message: IRolesPermissionsDataMessage.deleteSuccess }
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<IRolesPermissionsDatafindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {
        return { status: true, message: IRolesPermissionsDataMessage.foundSuccess, data: result }
      } else {
        return { status: false, message: IRolesPermissionsDataMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }



  async findManyModule(
    page?: number,
    count?: number,
    filter?: string,
    status?: boolean
  ): Promise<IRolesPermissionsDatafindManyRes> {
    try {
      let match = {};
      count = Number(count || 100000000);
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
            name: { $regex: new RegExp(filter, "i") }
          },
          { crop: { $regex: new RegExp(filter, "i") } }]
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
          message: IRolesPermissionsDataMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IRolesPermissionsDataMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }


  async findAllRoleGroupsDropDown(
    userTypeInternalOrExternal: any,
    withPermissions: boolean,
    status?: boolean
  ): Promise<IRoleGroupsDatafindManyRes> {
    try {
      let aggregate: any[] = [];
      let match = {};
      if (userTypeInternalOrExternal) {
        match = { ...match, ...{ userTypeInternalOrExternal: userTypeInternalOrExternal } };
      }
      if (status) {
        match = { ...match, ...{ status: status } };
      }
      if (match) {
        aggregate.push({ $match: match });
      }
      let project = {};
      if (withPermissions) {
        project = { roleName: 1, userTypeInternalOrExternal: 1, roleSeniorityLevel: 1, permissionsData: 1 }
      } else {
        project = { roleName: 1, userTypeInternalOrExternal: 1, roleSeniorityLevel: 1 }
      }
      aggregate.push({ $project: project });
      aggregate.push({ $sort: { roleSeniorityLevel: 1 } });
      let result = await this.Module.aggregate(aggregate);
      if (result) {
        return {
          status: true,
          message: IRolesPermissionsDataMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IRolesPermissionsDataMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findRoleBySeniorityLevel(roleLevel): Promise<IRolesSeniorityLevelDataRes> {
    try {
      let aggregate: any[] = [];
      if (roleLevel) {
        aggregate.push({ $match: { roleSeniorityLevel: Number(roleLevel) } });
      }
      aggregate.push({ $project: { roleName: 1, userTypeInternalOrExternal: 1, roleSeniorityLevel: 1 } });
      let result = await this.Module.aggregate(aggregate);
      if (result) {
        return {
          status: true,
          message: IRolesPermissionsDataMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IRolesPermissionsDataMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }





}
