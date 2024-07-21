import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { createLedgerStatementDtoCredit, createLedgerStatementDto, ILedgerDatafindManyRes } from './ledger.dto';
import { LedgerService } from './ledger.service';
import { UserService } from '../users/user.service';
import { Role } from '../roles/roles.enum';

// import { CatalogModule } from '../catalog/catalog.module';
// import { LotDataService } from './lot-data.service';
// import { CreateLotDataDto, UpdateLotDataDto, LotDatafindOneByIdRes, EItemStatus, ILotDataMessage, ILotDatafindManyRes } from './lot-data.dto';


@ApiTags('ledger')
@Controller('ledger')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class LedgerController {
  constructor(private Service: LedgerService, private userService: UserService) { }

  //     @UseGuards(AuthGuard('JWTaccessToken'))
  // @Post("/create")
  // @ApiBearerAuth('JWT_TOKNE')
  // @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'})
  // @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async Create(@Body() createLedgeDtoDebit: createLedgerStatementDtoDebit, @Body() createLedgeDtoCredit: createLedgerStatementDtoCredit, @Req() req: Request, @Res() res: Response) {
  //     //     const user: any = req.user;
  //     //     createInvoiceDto["salesPersonId"] = user.profileId;
  //     //     createInvoiceDto["salesPersonName"] = `${user.firstName} ${user.lastName}`;
  //         let result = await this.Service.createModule(createLedgeDtoDebit, createLedgeDtoCredit);
  //         res.status(HttpStatus.CREATED).send(result);
  // }




  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('statement/all')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ILedgerDatafindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findstatementAll(
    @Res() res: Response,
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('count') count?: number,
    @Query('statementProfileIdRequired') statementProfileIdRequired?: string,
    @Query('filter') filter?: string,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,
  ) {
    const user: any = req.user;
    const getUserInfo = await this.userService.findOneModule(user.userId);
    if (getUserInfo.data.permissionsData.salesOrders.CAN_READ) {
      let userLinkedToProfileId: any;
      if (user.roles[0] === Role.DISTRIBUTOR) {
        userLinkedToProfileId = getUserInfo.data.userLinkToProfileId;
      }
      let result = await this.Service.findManyModule(page, count, user.roles[0], userLinkedToProfileId || null, statementProfileIdRequired || null, filter || null, dateFrom, dateTo);
      res.status(HttpStatus.OK).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: 'IOrderMessage.failedUnauthorisedAccessFind',
      });
    }


  }







  ///dont use this
  // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Get('statement/distributor')
  // // @Roles(Role.ADMIN)
  // @ApiBearerAuth('JWT_TOKNE')
  // @ApiOkResponse({ type: ILedgerDatafindManyRes, description: 'Found Successfully' })
  // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  // @ApiRequestTimeoutResponse({ description: 'Time Out' })
  // async findstatementAllDistributor(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Query('page') page?: number,
  //   @Query('count') count?: number,
  //   @Query('filter') filter?: string,
  //   @Query('particularType') particularType?: string,
  //   @Query('dateFrom') dateFrom?: Date,
  //   @Query('dateTo') dateTo?: Date,
  // ) {
  //     const user: any = req.user;
  //     // const user = {
  //     //     "firstName": "karta",
  //     //     "lastName": "karta",
  //     //     "phoneNo": "7474785858",
  //     //     "email": "dist1@gmail.com",
  //     //     "userId": "631f3fdf8d39cd0379f544c6",
  //     //     "profileId": "631f3fdf8d39cd0379f544c7",
  //     //     "roles": [
  //     //       "DISTRIBUTOR"
  //     //     ],
  //     //     "iat": 1667846710183,
  //     //     "exp": 1667846710183
  //     //   }         
  //     let result = await this.Service.findManyModuleForDistributorLedger(page, count, user.profileId, user.roles[0], particularType || null, filter || null, dateFrom, dateTo );
  //   res.status(HttpStatus.OK).send(result);
  // }









  // // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Get('statement')
  // @ApiBearerAuth('JWT_TOKNE')
  // @ApiOkResponse({ type: ILedgerDatafindManyRes, description: 'Found Successfully' })
  // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  // @ApiRequestTimeoutResponse({ description: 'Time Out' })
  // async findstatementAll(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Query('page') page: number,
  //   @Query('count') count: number,
  //   @Query('filter') filter: string,
  //   @Query('dateFrom') dateFrom?: Date,
  //   @Query('dateTo') dateTo?: Date,
  // ) {
  //     // const user: any = req.user;
  // console.log(user);
  //     const user = {
  //         "firstName": "Gourish",
  //         "lastName": "Bemalgi",
  //         "phoneNo": "9666268384",
  //         "email": "gsbemalgi@naomiseeds.com",
  //         "userId": "629fe7502ec8960873b3ff90",
  //         "profileId": "629fe7502ec8960873b3ff91",
  //         "roles": [
  //           "ADMIN"
  //         ],
  //         "iat": 1659672530979,
  //         "exp": 1659672530979
  //       }
  //   let result = await this.Service.findManyModule(page, count, user.profileId, null, filter || null, dateFrom, dateTo );
  //   res.status(HttpStatus.OK).send(result);
  // }














  //     // @UseGuards(AuthGuard('JWTaccessToken'))
  //     @Get('statement/:profileId')
  //     @ApiBearerAuth('JWT_TOKNE')
  //     @ApiOkResponse({ type: ILedgerDatafindManyRes, description: 'Found Successfully' })
  //     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  //     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  //     @ApiRequestTimeoutResponse({ description: 'Time Out' })
  //     async findManyAll(
  //       @Res() res: Response,
  //       @Req() req: Request,
  //       @Query('page') page: number,
  //       @Query('count') count: number,
  //       @Query('filter') filter: string,
  //     //   @Query('type') type?: string,
  //       @Query('dateFrom') dateFrom?: Date,
  //       @Query('dateTo') dateTo?: Date,
  //       @Query('profileId') profileId?: string,
  //     ) {
  //         // const user: any = req.user;
  // console.log(user);
  //         const user = {
  //             "firstName": "Gourish",
  //             "lastName": "Bemalgi",
  //             "phoneNo": "9666268384",
  //             "email": "gsbemalgi@naomiseeds.com",
  //             "userId": "629fe7502ec8960873b3ff90",
  //             "profileId": "629fe7502ec8960873b3ff91",
  //             "roles": [
  //               "ADMIN"
  //             ],
  //             "iat": 1659672530979,
  //             "exp": 1659672530979
  //           }
  //       let result = await this.Service.findManyModule(page, count, null, profileId, filter || null, dateFrom, dateTo);
  //       res.status(HttpStatus.OK).send(result);
  //     }





  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('dashboard/distributor/overview')
  @ApiBearerAuth('JWT_TOKNE')
  // @ApiOkResponse({ type: IInvCNSummaryRes, description: 'Calculated Successfully' })
  // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  // @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async dashboardSummary(
    @Res() res: Response,
    @Req() req: Request,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,
  ) {
    const user: any = req.user;


    // const user = {
    //   "firstName": "karta",
    //   "lastName": "karta",
    //   "phoneNo": "7474785858",
    //   "email": "dist1@gmail.com",
    //   "userId": "631f3fdf8d39cd0379f544c6",
    //   "profileId": "631f3fdf8d39cd0379f544c7",
    //   "roles": [
    //     "DISTRIBUTOR"
    //   ],
    //   "iat": 1667846710183,
    //   "exp": 1667846710183
    // }


    // const profileId = '627d382df7337804d2e709fc';
    // const dateFrom = "2022-07-02T00:00:00.000Z";
    // const dateTo = "2022-07-08T00:00:00.000Z";
    // console.log('here');

    let result = await this.Service.aggregateDashboardFinancialsForDistributor(user.profileId, dateFrom, dateTo);
    res.status(HttpStatus.OK).send(result);
  }










}