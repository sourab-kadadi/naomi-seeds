import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { CatalogModule } from '../catalog/catalog.module';
import { LotDataService } from './lot-data.service';
import { CreateLotDataDtoInput, LotDatafindOneByIdRes, EItemStatus, ILotDataMessage, ILotDatafindManyRes, UploadLotData, ILotDatafindManyDropDownRes } from './lot-data.dto';
import { ProfileService } from '../profile/profile.service';
import { UserService } from '../users/user.service';
import { RoleUpdated } from '../users/user-role.enum';
import { user } from '../users/user.schema';


@ApiTags('LotData')
@Controller('LotData')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
// @Controller('lot-data')
export class LotDataController {
  constructor(private Service: LotDataService, private userService: UserService,) { }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('/create')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() CreateLotDataDtoInput: CreateLotDataDtoInput, @Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
      const getUserProfileInfo = await this.userService.findOneModule(user.userId);
      if (getUserProfileInfo.data.permissionsData.lotData.CAN_CREATE) {
        let result = await this.Service.createModule(CreateLotDataDtoInput, user.userId);
        res.status(HttpStatus.CREATED).send(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ status: false, message: ILotDataMessage.failedUnauthorisedAccessCreate });
      }
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('/update/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() updateLotDataDto: UploadLotData, @Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
    const getUserProfileInfo = await this.userService.findOneModule(user.userId);
    if (getUserProfileInfo.data.permissionsData.lotData.CAN_EDIT) {
    let result = await this.Service.updateModule(_id, updateLotDataDto, user.profileId);
    res.status(HttpStatus.OK).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({ status: false, message: ILotDataMessage.failedUnauthorisedAccessCreate });
    }
  }



  // // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Delete('/delete/:_id')
  // // @ApiBearerAuth('JWT_TOKNE')
  // @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
  // @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  // @ApiRequestTimeoutResponse({ description: 'Time Out' })
  // async delete(@Param('_id') _id: string, @Req() req: Request, @Res() res: Response) {
  //   // const user: any = req.user;
  //   const user = {
  //     "firstName": "temp",
  //     "lastName": "temp",
  //     "phoneNo": "1236547892",
  //     "email": "temp@gmail.com",
  //     "userId": "62862e15247c5e039b872ed6",
  //     "profileId": "62862e15247c5e039b872ed7",
  //     "roles": [
  //       "ADMIN"
  //     ],
  //     "iat": 1657406968632,
  //     "exp": 1657406968632
  //   }

  //   let result = await this.Service.deleteModule(_id, user.profileId);
  //   res.status(HttpStatus.OK).send(result);
  // }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: LotDatafindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
      const getUserInfo = await this.userService.findOneModule(user.userId);
      if (getUserInfo.data.permissionsData.lotData.CAN_READ) {
        let result = await this.Service.findOneModule(_id);
        res.status(HttpStatus.OK).send(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ status: false, message: ILotDataMessage.failedUnauthorisedAccessFind });
      }
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find-one-expanded/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: LotDatafindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneExpandedById(@Param('_id') _id: string, @Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
      const getUserInfo = await this.userService.findOneModule(user.userId);
      if (getUserInfo.data.permissionsData.lotData.CAN_READ) {
        let result = await this.Service.findOneExpanded(_id);
        res.status(HttpStatus.OK).send(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ status: false, message: ILotDataMessage.failedUnauthorisedAccessFind });
      }
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('all')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ILotDatafindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyAll(
    @Res() res: Response,
    @Req() req: Request,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('productId') productId?: any,
    @Query('filter') filter?: string,
    @Query('lotValidityAvailable') lotValidityAvailable?: boolean,
    @Query('lotDataEditable') lotDataEditable?: boolean,
  ) {
    const user: any = req.user;
      const getUserInfo = await this.userService.findOneModule(user.userId);
      if (getUserInfo.data.permissionsData.lotData.CAN_READ) {
        let result = await this.Service.findManyModule(page, count, user.userId, productId, filter || null, lotValidityAvailable, lotDataEditable);
        res.status(HttpStatus.OK).send(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ status: false, message: ILotDataMessage.failedUnauthorisedAccessFind });
      }
  }







  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('dropdown-all-lot-data-by-product-by-validity/:productId')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ILotDatafindManyDropDownRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllDropDown(@Res() Res: Response, @Req() Req: Request, @Param('productId') productId?: any) {
    try {
      let result = await this.Service.findAllLotDropDown(productId, true);
        Res.status(HttpStatus.OK).send(result);
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }





















// ///not in use
//   @UseGuards(AuthGuard('JWTaccessToken'))
//   @Get('quantityAvailable/all/:productId')
//   @ApiBearerAuth('JWT_TOKNE')
//   @ApiOkResponse({ type: ILotDatafindManyRes, description: 'Found Successfully' })
//   @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//   @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//   @ApiRequestTimeoutResponse({ description: 'Time Out' })
//   async findManyActive(
//     @Res() res: Response,
//     @Req() req: Request,
//     // @Query('productId') productId: string,
//     @Param('productId') productId: string,
//   ) {


//     let result = await this.Service.findManyQuantityAvailableModule(user.profileId, productId);
//     res.status(HttpStatus.OK).send(result);
//   }




  










}
