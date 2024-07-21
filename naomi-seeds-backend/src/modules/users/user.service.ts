import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.interface';
import { UserDto, LoginDto, ILoginTokenPayload, ILoginPayload, UpdateUserDto, EmailDto, IUserMessage, UserfindOneByIdRes, UserfindManyRes, UserfindManyByRoleRes } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IjwtTokenSecrate } from 'src/config/configration.dto';
import { ProfileService } from '../profile/profile.service';
import { MailsService } from '../mails/mails.service';
import { OtpService } from '../otp/otp.service';
import { ResetPasswordDto } from '../otp/otp.dto';
import { IModuleRes } from 'src/common.service';
import { RoleUpdated } from './user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private profileService: ProfileService,
    private mailsService: MailsService,
    private otpService: OtpService,
  ) { }

  async generateHash(password: string): Promise<string> {
    let salt = bcrypt.genSaltSync(12);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  }



  async createModule(userDto: UserDto): Promise<any> {
    try {
      const createUser = new this.userModel(userDto);
      await createUser.save();
      return { status: true, message: IUserMessage.createdSuccess };
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(`${DuplicateArrayToString} Aleary Exist`, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(error._message || "Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  async updateModule(_id: string, userDto: UpdateUserDto): Promise<IModuleRes> {
    try {
      let result = await this.userModel.updateOne({ _id: _id }, { $set: userDto });
      return { status: true, message: IUserMessage.updateSuccess }
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



  async findOneModule(_id: any): Promise<UserfindOneByIdRes> {
    try {
      let result = await this.userModel.findOne({ _id: new mongoose.Types.ObjectId(_id) }, { psw: 0 });
      if (result) {
        return { status: true, message: IUserMessage.foundSuccess, data: result }
      } else {
        return { status: false, message: IUserMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }













































































  // async CreateUser(UserDto: UserDto): Promise<any> {
  //   try {

  //     const session = await this.userModel.db.startSession();
  //     session.startTransaction();
  //     try {

  //       // UserDto.psw = await this.generateHash(UserDto.psw);
  //       const createUser = new this.userModel(UserDto);
  //       let result = await createUser.save({session});
  //       UserDto.profile["userId"] = result._id;
  //       await this.profileService.createModule(UserDto.profile);
  //       await session.commitTransaction();
  //       // await this.mailsService.sendUserSignupMail(UserDto);
  //       return {message: "Registered Successfully"};
  //     } catch (error) {
  //       await session.abortTransaction();
  //       if (error.code && error.code == 11000) {
  //         let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
  //         let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
  //         throw new HttpException(
  //           (DuplicateArrayToString == 'phoneNo' ? 'Phone Number' : 'Email')  + ' Already Exist',
  //           HttpStatus.CONFLICT,
  //         );
  //       } else {
  //          throw error;
  //       }
  //     } finally {
  //       session.endSession();
  //     }
  //   } catch(error) {
  //     throw error;
  //   }
  // }

  async verifyUser(LoginDto: LoginDto): Promise<any> {
    try {
      let user = await this.userModel.findOne({ email: LoginDto.email });
      let verify = await this.verifyBcrypt(LoginDto.psw, user.psw);
      if (user && verify) {
        let userObj = {
          email: user.email,
          userId: user._id
        };
        return userObj;
      }
      return null;
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async updateActiveTime(userId: string): Promise<any> {
    try {
      let user = await this.userModel.updateOne({ userId: userId }, { $set: { lastActiveDate: new Date() } });
      if (user) {
        // let userObj = {
        //   email: user.email,
        //   userId: user._id,
        //   userName: user.userName,
        // };
        return user;
      }
      return null;
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyBcrypt(psw: string, hash: string): Promise<boolean> {
    return bcrypt.compareSync(psw, hash);
  }

  async login(user: any): Promise<ILoginTokenPayload> {
    let aggregate: any[] = await this.userModel.aggregate([
      { $match: { email: user.email } },
      // {
      //   $lookup: {
      //     from: 'profiles',
      //     localField: '_id',
      //     foreignField: 'userId',
      //     as: 'profile',
      //   },
      // },
      // { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    ]);
    const payload: ILoginPayload = {
      firstName: aggregate[0].firstName,
      lastName: aggregate[0].lastName,
      phoneNo: aggregate[0].phoneNo,
      email: user.email,
      userId: aggregate[0]._id,
      // profileId:  aggregate[0].profile && aggregate[0].profile._id ?  aggregate[0].profile._id : null,
      // roles: aggregate[0].profile && aggregate[0].profile.roles ?  aggregate[0].profile.roles : null,
      roles: aggregate[0].roles,
      iat: new Date().getTime()
    };
    let accessToken = await this.generateAccessToken(payload);
    let accessCookies = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=Session`;
    let refreshToken = await this.generateRefreshToken(payload);
    let refreshCookies = `RefreshToken=${refreshToken}; Path=/; Max-Age=Session`;
    return {
      accessToken: {
        cookies: accessCookies,
        token: accessToken
      },
      refreshToken: {
        cookies: refreshCookies,
        token: refreshToken
      },
      payload: payload
    };
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('expiryToken.refresh_token_exp')}`
    });
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('expiryToken.access_token_exp')}`
    });
  }

  logOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }


  async updateUser(userId: string, updateUser: UpdateUserDto) {
    let user = await this.userModel.updateOne({ _id: userId }, { $set: updateUser });
    if (user) {
      return { message: "Updated Successfully" };
    }
    throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  }


  // async updateCompany(userId: string, updateUser:  UpdateUserDto) {
  //   let user = await this.userModel.updateOne({ _id: userId }, {$set: updateUser});
  //   if (user && user.n > 0) {
  //     return {message: "Updated Successfully"};
  //   }
  //   throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  // }



  async forgotPassword(EmailDto: EmailDto): Promise<IModuleRes> {
    try {
      let user = await this.userModel.findOne({ email: EmailDto.email });
      const EmailOtpDto = {
        userId: user._id,
        email: EmailDto.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      if (user) {
        await this.otpService.generateOtp(EmailOtpDto);
        return { status: true, message: IUserMessage.otpSentSuccess };
      } else {
        return { status: false, message: IUserMessage.notFound }
      }
    } catch (error) {
      throw error;
      //  throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, userId: string): Promise<IModuleRes> {
    try {
      resetPasswordDto.password = await this.generateHash(resetPasswordDto.password);
      let result = await this.userModel.updateOne({ _id: userId }, { $set: { psw: resetPasswordDto.password } });
      if (result) {
        return { status: true, message: IUserMessage.passwordResetSuccess }
      } else {
        return { status: false, message: IUserMessage.passwordResetFailed }
      }
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + 'Already Exist',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

  async findOneModuleByUserPermissions(userId: string, pageLocation?: string): Promise<UserfindOneByIdRes> {
    try {
      let projectionKey: any;
      if (pageLocation) {
        projectionKey = `permissionsData.${pageLocation}`;
      } else {
        projectionKey = "permissionsData";
      }
      let result = await this.userModel.findOne({ _id: userId }, { [projectionKey]: 1, userTypeInternalOrExternal: 1, roles: 1, userLinkToProfileId: 1 });
      if (result) {
        return { status: true, message: IUserMessage.foundSuccess, data: result };
      } else {
        return { status: false, message: IUserMessage.notFound, data: null };
      }
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }






  async findManyModule(
    page?: number,
    count?: number,
    filter?: string,
    role?: any,
    status?: boolean
  ): Promise<UserfindManyRes> {
    try {
      let match = {};
      if (role) {
        match = { ...match, ...{ roles: role } }
      }
      count = Number(count || 10);
      page = Number(page || 0);
      let totalCount: any = [{ $count: 'count' }];
      let item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
        {
          $project: {
            psw: 0
          }
        }
      ]
      if (filter && filter != '') {
        let search = {
          $or: [{
            firstName: { $regex: new RegExp(filter, "i") }
          },
          { lastName: { $regex: new RegExp(filter, "i") } },
          { userLinkToProfileCompanyName: { $regex: new RegExp(filter, "i") } }
          ]
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
      let result = await this.userModel.aggregate([
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
          message: IUserMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IUserMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }



  async findAllUserRoleDropDown(
    userRole: RoleUpdated,
    status?: boolean
  ): Promise<UserfindManyByRoleRes> {
    try {
      let aggregate: any[] = [];
      let match = {};
      if (userRole) {
        match = { ...match, ...{ roles: { $in: [userRole] }} };
      }
      if (status) {
        match = { ...match, ...{ status: status } };
      }
      if (match) {
        aggregate.push({ $match: match });
      }
      aggregate.push({ $project: { _id: 1, "name" : { $concat: [ "$firstName", ' ', "$lastName" ] }  } });     
      let result = await this.userModel.aggregate(aggregate);
      if (result) {
        return {
          status: true,
          message: IUserMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IUserMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }














}

