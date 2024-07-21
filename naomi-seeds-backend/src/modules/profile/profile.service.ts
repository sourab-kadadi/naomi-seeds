import {
  HttpException,
  HttpStatus,
  Injectable,
  Ip,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { IModuleRes } from '../../common.service';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';
import { Role } from '../roles/roles.enum';
import {
  ProfileDto,
  ProfilefindManyByRoleRes,
  ProfilefindManyRes,
  ProfilefindOneByIdRes,
  ProfileUpdateDto,
} from './profile.dto';
import { IProfileMessage, Profile } from './profile.interface';
import { ProfileRole } from './profile-role.enum';
import {
  ADMIN_PROJECTION_LIST,
  SALES_OFFICER_PROJECTION_LIST,
} from './profile.projection';
import { RoleUpdated } from '../users/user-role.enum';
@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private readonly Module: Model<Profile>,
    private rolesPermissionService: RolesPermissionsService,
  ) {}

  async createModule(profileDto: ProfileDto): Promise<IModuleRes> {
    try {
      // let resultRolesPermission = await this.rolesPermissionService.findOneModule(ProfilesDto.roleGroupRefId)
      // ProfilesDto.permissionsData = resultRolesPermission.data.permissionsData;
      // ProfilesDto.userTypeInternalOrExternal = resultRolesPermission.data.userTypeInternalOrExternal;
      const createUser = new this.Module(profileDto);
      await createUser.save();
      return { status: true, message: IProfileMessage.createdSuccess };
    } catch (error) {
      if (error.code && error.code == 11000) {
        const findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        const DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          `${DuplicateArrayToString} Aleary Exist`,
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          error._message || 'Something went wrong. Please try after sometime',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateModule(
    ProfilesId: string,
    ProfilesDto: ProfileUpdateDto,
  ): Promise<IModuleRes> {
    try {
      await this.Module.updateOne({ _id: ProfilesId }, { $set: ProfilesDto });
      return { status: true, message: IProfileMessage.updateSuccess };
    } catch (error) {
      if (error.code && error.code == 11000) {
        const findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        const DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + ' Aleary Exist',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          'Something went wrong. Please try after sometime',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteModule(ProfilesId: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: ProfilesId });
      return { status: true, message: IProfileMessage.deleteSuccess };
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Please try after sometime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  async findOneModule(profileId: string): Promise<ProfilefindOneByIdRes> {
    try {
      const result = await this.Module.findOne({
        _id: new mongoose.Types.ObjectId(profileId)})
      if (result) {
        return {
          status: true,
          message: IProfileMessage.foundSuccess,
          data: result,
        };
      } else {
        return { status: false, message: IProfileMessage.notFound, data: null };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Please try after sometime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneModuleByProfileId(
    profileId: string,
  ): Promise<ProfilefindOneByIdRes> {
    try {
      const result = await this.Module.findOne({
        _id: new mongoose.Types.ObjectId(profileId),
      });
      if (result) {
        return {
          status: true,
          message: IProfileMessage.foundSuccess,
          data: result,
        };
      } else {
        return { status: false, message: IProfileMessage.notFound, data: null };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Please try after sometime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async findOneModuleByProfilePermissions(ProfilesId: string, pageLocation?: string): Promise<ProfilefindOneByIdRes> {
  //   try {
  //     let projectionKey: any;
  //     if(pageLocation) {
  //       projectionKey = `permissionsData.${pageLocation}`;
  //     } else {
  //       projectionKey = "permissionsData";
  //     }
  //     let result = await this.Module.findOne({ _id: ProfilesId }, { [projectionKey]: 1, userTypeInternalOrExternal: 1, roles: 1} );
  //     console.log(ProfilesId)
  //     if (result) {
  //       return { status: true, message: IProfileMessage.foundSuccess, data: result };
  //     } else {
  //       return { status: false, message: IProfileMessage.notFound, data: null };
  //     }
  //   } catch (error) {
  //     throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async findCompanyModule(role: string): Promise<ProfilefindOneByIdRes> {
    try {
      const result = await this.Module.findOne({ profileRole: role });
      if (result) {
        return {
          status: true,
          message: IProfileMessage.foundSuccess,
          data: result,
        };
      } else {
        return { status: false, message: IProfileMessage.notFound, data: null };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Please try after sometime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllProfileRoleGroupsDropDown(
    profileRole: ProfileRole,
    status?: boolean,
  ): Promise<ProfilefindManyByRoleRes> {
    try {
      const aggregate: any[] = [];
      let match = {};
      if (profileRole) {
        match = { ...match, ...{ profileRole: profileRole } };
      }
      if (status) {
        match = { ...match, ...{ status: status } };
      }
      if (match) {
        aggregate.push({ $match: match });
      }
      // aggregate.push({ $project: { roleName: 1, userTypeInternalOrExternal: 1, roleSeniorityLevel: 1 } });
      // aggregate.push({ $sort: { roleSeniorityLevel: 1 } });
      const result = await this.Module.aggregate(aggregate);
      if (result && result.length > 0) {
        return {
          status: true,
          message: IProfileMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IProfileMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Please try after sometime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findManyModule(
    user: any,
    page: number,
    count: number,
    filter: string,
    profileRole: ProfileRole,
    status?: boolean,
  ): Promise<ProfilefindManyRes> {
    try {
      let project: any;
      if (user.roles[0] === RoleUpdated.ADMIN) {
        project = ADMIN_PROJECTION_LIST;
        profileRole = ProfileRole.DISTRIBUTOR;
      } else if (user.roles[0] === RoleUpdated.SALES_OFFICER) {
        project = SALES_OFFICER_PROJECTION_LIST;
        profileRole = ProfileRole.DISTRIBUTOR;
      }

      let match = {};
      count = Number(count || 10);
      page = Number(page || 0);
      const totalCount: any = [{ $count: 'count' }];
      const item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
        { $project: project },
        // {
        //   $lookup: {
        //     from: 'users',
        //     localField: 'userId',
        //     foreignField: '_id',
        //     as: 'userData',
        //   },
        // },
        // { $unwind: "$userData" }
      ];
      if (filter && filter != '') {
        const search = {
          $or: [
            // { addressDetails: { city: { $regex: new RegExp(filter, "i") } }},
            { companyName: { $regex: new RegExp(filter, 'i') } },
            // { userData: { firstName: { $regex: new RegExp(filter, "i") } }},
            // { addressDetails.city: { $regex: new RegExp(filter, "i") } },
            // { userData.firstName: { $regex: new RegExp(filter, "i") } },
          ],
        };
        match = { ...match, ...search };
      }
      if (profileRole) {
        match = { ...match, ...{ profileRole: profileRole } };
      }
      if (status) {
        match = { ...match, ...{ status: status } };
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
          message: IProfileMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IProfileMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  //use the below code dow dropdown and also to fetch all the alloted distributors for sales officer and manager
  async findAllDropDownForAllotedDistributors(
    userId: any,
    userRole: string,
    status?: boolean,
  ): Promise<ProfilefindManyByRoleRes> {
    try {
      const aggregate: any[] = [];
      let match = {profileRole: ProfileRole.DISTRIBUTOR};
      if (userRole.includes(RoleUpdated.SALES_OFFICER)) {
        match = {
          ...match,
          ...{ firstLevelReportingUserID: new mongoose.Types.ObjectId(userId) },
        };
      } else if (userRole.includes(RoleUpdated.MANAGER)) {
        match = {
          ...match,
          ...{ secondLevelReportingUserID: new mongoose.Types.ObjectId(userId),
          },
        };
      }
      if (status) {
        match = { ...match, ...{ status: status } };
      }
      if (match) {
        aggregate.push({ $match: match });
      }
     let project = {};
      project = { _id: 1, companyName: 1, profileRole: 1 };
      aggregate.push({ $project: project });
      const result = await this.Module.aggregate(aggregate);
      if (result && result.length > 0) {
        return {
          status: true,
          message: IProfileMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IProfileMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Please try after sometime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
