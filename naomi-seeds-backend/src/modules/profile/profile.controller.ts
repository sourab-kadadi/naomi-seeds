import { Response, Request } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, Headers, Query, UseFilters } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { ProfileDto, ProfileUpdateDto, ProfilefindOneByIdRes, ProfilefindManyRes } from './profile.dto';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { Role } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesPermissionsService } from '../roles-permissions/roles-permissions.service';
import { ProfileRole } from './profile-role.enum';
import { IProfileMessage } from './profile.interface';
import { RoleUpdated } from '../users/user-role.enum';
@ApiTags('Profile')
@Controller('profile')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class ProfileController {
  constructor(private Service: ProfileService, private rolesPermissionService: RolesPermissionsService) { }

  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Post("/create")
  // @Roles(Role.ADMIN)
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() profileDto: ProfileDto, @Req() Req: Request, @Res() Res: Response) {
    try {
      let user: any = Req.user;
      // profileDto.userId = user.userId;
      let result = await this.Service.createModule(profileDto);
      if (result.status == true) {
        Res.status(HttpStatus.CREATED).send(result);
      } else {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put("/update/:_id")
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() ProfileDto: ProfileUpdateDto, @Res() Res: Response) {
    try {
      let result = await this.Service.updateModule(_id, ProfileDto);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }


  // @Delete("/delete/:_id")
  // @ApiOkResponse({type: IModuleRes,description: 'Deleted Successfully'})
  // @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async delete(@Param('_id') _id: string, @Res() Res: Response) {
  //     try {
  //         let result = await this.Service.deleteModule(_id);
  //         if(result.status == true) {
  //         Res.status(HttpStatus.OK).send(result);
  //         } else {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
  //         }
  //        } catch (error) {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  //        }
  // }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get("find/:_id")
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ProfilefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    try {
      console.log(_id, 'id')
      let result = await this.Service.findOneModule(_id);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Get('profile-permissions/:pageLocation?')
  // @ApiBearerAuth('JWT_TOKNE')
  // @ApiOkResponse({type: ProfilefindOneByIdRes,description: 'Found Successfully'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async findMyProfilePermissions( @Req() req: Request, @Res() res: Response, @Param('pageLocation') pageLocation: string) {
  //     try {
  //         let user :any = req.user;
  //         let _id = user.profileId;
  //         let result = await this.Service.findOneModuleByProfilePermissions(_id, pageLocation);
  //         if(result.status == true) {
  //         res.status(HttpStatus.OK).send(result);
  //         } else {
  //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
  //         }
  //        } catch (error) {
  //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  // }
  // }



  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get("/findMyProfile")
  @ApiOkResponse({ type: ProfilefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findMyProfile(@Req() Req: Request, @Res() Res: Response) {
    try {
      let user: any = Req.user;
      let _id = user.profileId;
      let result = await this.Service.findOneModule(_id);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  //use the below code dow dropdown and also to fetch all the alloted distributors for sales officer and manager
  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find-all-alloted-distributors')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ProfilefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneExpandedById(@Param('_id') _id: string, @Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
        let result = await this.Service.findAllDropDownForAllotedDistributors(user.userId, user.roles[0], true);
        res.status(HttpStatus.OK).send(result);
  }


  // // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Get("active/distributor")
  // @ApiOkResponse({type: ProfilefindOneByIdRes,description: 'Found Successfully'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async findManyByDISTRIBUTOR(@Res() Res: Response) {
  //     try {
  //         let result = await this.Service.findManyDropDownModule(Role.DISTRIBUTOR, true);
  //         if(result.status == true) {
  //         Res.status(HttpStatus.OK).send(result);
  //         } else {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
  //         }
  //        } catch (error) {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  //        }
  // }

  // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Get("all/sales-office")
  // @ApiOkResponse({type: ProfilefindOneByIdRes,description: 'Found Successfully'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async findManyBySalesOffice(@Res() Res: Response) {
  //     try {
  //         let result = await this.Service.findManyDropDownModule(Role.SALES_OFFICER, true);
  //         if(result.status == true) {
  //         Res.status(HttpStatus.OK).send(result);
  //         } else {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
  //         }
  //        } catch (error) {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  //        }
  // }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put("/updateMyProfile")
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async updateMyProfile(@Body() ProfileDto: ProfileUpdateDto, @Req() Req: Request, @Res() Res: Response) {
    try {
      let user: any = Req.user;
      let _id = user.profileId;
      let result = await this.Service.updateModule(_id, ProfileDto);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }



  // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Get("/roles")
  // @ApiOkResponse({type: IModuleRes,description: 'Update Successfully'})
  // @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async getProfileRoles(@Res() Res: Response) {
  //     try {
  //         // Need to Make optimize
  //         const roles = [
  //             {
  //                 key: "Admin",
  //                 value: Role.ADMIN
  //             },
  //             {
  //                 key: "Director",
  //                 value: Role.DIRECTOR
  //             },
  //             {
  //                 key: "Operational Manager",
  //                 value: Role.OPERATIONAL_MANAGER
  //             },
  //             {
  //                 key: "Accountant",
  //                 value: Role.ACCOUNTANT
  //             },
  //             {
  //                 key: "DISTRIBUTOR",
  //                 value: Role.DISTRIBUTOR
  //             },
  //             {
  //                 key: "Manager",
  //                 value: Role.MANAGER
  //             },
  //             {
  //                 key: "Sales Officer",
  //                 value: Role.SALES_OFFICER
  //             },
  //             {
  //                 key: "Plant Manager",
  //                 value: Role.PLANT_MANAGER
  //             }
  //         ];
  //         Res.status(HttpStatus.OK).send({message: "List of Roles", data: roles});
  //        } catch (error) {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  //        }
  // }

  @UseGuards(AuthGuard('JWTaccessToken'))
  // guard is throwing error and not working check the reason
  @Get('all')
  @ApiOkResponse({ type: ProfilefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyAll(
    @Res() Res: Response,
    @Req() Req: Request,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('filter') filter?: string,
    @Query('profileRole') profileRole?: ProfileRole,
    @Query('status') status?: boolean,
  ) {
    let user = Req.user;
    let result = await this.Service.findManyModule(user, page, count, filter || null, profileRole, status);
    Res.status(HttpStatus.OK).send(result);
  }



  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('dropdown-all/:profileRole')
  @ApiOkResponse({ type: ProfilefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllDropDownByProfileRole(@Param('profileRole') profileRole: ProfileRole, @Res() Res: Response) {
    try {
      let result = await this.Service.findAllProfileRoleGroupsDropDown(profileRole, true);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('dropdown/distributors-all')
  @ApiOkResponse({ type: ProfilefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllDistributorProfileDropDown(@Res() Res: Response, @Req() req: Request) {
    try {
      const user: any = req.user;
      // if ([RoleUpdated.ADMIN, RoleUpdated.DIRECTOR, RoleUpdated.PLANT_MANAGER, RoleUpdated.MANAGER, RoleUpdated.OPERATIONAL_MANAGER, RoleUpdated.ACCOUNTANT].some(role => role === user.roles[0])) {
        if (true) {
        let result = await this.Service.findAllProfileRoleGroupsDropDown(ProfileRole.DISTRIBUTOR, true);
        Res.status(HttpStatus.OK).send(result);
      } else {
        return Res.status(HttpStatus.BAD_REQUEST).send({ status: false, message: IProfileMessage.failedUnauthorisedAccessFind });
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }


}




