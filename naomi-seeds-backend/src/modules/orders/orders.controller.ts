import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiRequestTimeoutResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateOrderDto,
  CreateReturnOrderDto,
  IOrderMessage,
  IOrderfindManyRes,
  TypeOfSale,
} from './orders.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleUpdated } from '../users/user-role.enum';
import { OrdersService } from './orders.service';
import { UserService } from '../users/user.service';
import { PdfServiceService } from '../pdf-service/pdf-service.service';

@Controller('orders')
@ApiTags('orders')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private userService: UserService,
    private pdfService: PdfServiceService
  ) {}

  /////create sales order by plant manager/////
  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('/createSalesPM')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async CreateSalesPM(
    @Body() createSalesDto: CreateOrderDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: any = req.user;
    const getUserProfileInfo = await this.userService.findOneModule(
      user.userId,
    );
    if (getUserProfileInfo.data.permissionsData.salesOrders.CAN_CREATE) {
      const result = await this.ordersService.createModuleOrder(
        createSalesDto,
        user,
        // createSalesDto.orderType
        );
      res.status(HttpStatus.CREATED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: IOrderMessage.failedUnauthorisedAccessCreate,
      });
    }
  }



    // /////create sales Return by plant manager/////
    // @UseGuards(AuthGuard('JWTaccessToken'))
    // @Post('/createSalesReturnPM')
    // @ApiBearerAuth('JWT_TOKNE')
    // @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    // @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    // @ApiRequestTimeoutResponse({ description: 'Time Out' })
    // async CreateSalesReturnPM(
    //   @Body() createReturnOrderDto: CreateReturnOrderDto,
    //   @Req() req: Request,
    //   @Res() res: Response,
    // ) {
    //   const user: any = req.user;
    //   const getUserProfileInfo = await this.userService.findOneModule(
    //     user.userId,
    //   );
    //   if (getUserProfileInfo.data.permissionsData.salesOrders.CAN_CREATE) {
    //     const result = await this.ordersService.createModuleOrder(
    //       createReturnOrderDto,
    //       user,
    //       TypeOfSale.SALES_RETURN
    //     );
    //     res.status(HttpStatus.CREATED).send(result);
    //   } else {
    //     return res.status(HttpStatus.BAD_REQUEST).send({
    //       status: false,
    //       message: IOrderMessage.failedUnauthorisedAccessCreate,
    //     });
    //   }
    // }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: IOrderfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    type: IModuleRes,
    description: 'Internal Server Error',
  })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(
    @Param('_id') _id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user: any = req.user;
    const getUserInfo = await this.userService.findOneModule(user.userId);
    if (getUserInfo.data.permissionsData.salesOrders.CAN_READ) {
      const result = await this.ordersService.findOneModule(
        _id,
        user.userId,
        user.roles[0],
        getUserInfo.data.userLinkToProfileId,
      );
      res.status(HttpStatus.OK).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: IOrderMessage.failedUnauthorisedAccessFind,
      });
    }
  }

  //     check all sales orders for plant manager, operational manager, director, admin, accountant
  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('list-active/all')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: IOrderfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    type: IModuleRes,
    description: 'Internal Server Error',
  })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManySalesPM(
    @Res() res: Response,
    @Req() req: Request,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('search') search: string,
    @Query('selectedDistributorProfileId') selectedDistributorProfileId: any,
    @Query('pendingApprovalMyEnd') pendingApprovalMyEnd?: boolean,
    @Query('managerFinalApproval') managerFinalApproval?: any,
    @Query('typeOfSale') typeOfSale?: any,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,

    // @Query('orderInProcess') orderInProcess?: boolean,
    // @Query('completedOrders') completedOrders?: boolean,

    // @Query('fromProfileApproval') fromProfileApproval?: any,
    // @Query('managerApprovalGenerateDC') managerApprovalGenerateDC?: any,
    // @Query('salesOfficerApprovalStatus') salesOfficerApprovalStatus?: any,
    // @Query('toProfileConfirmation') toProfileConfirmation?: any,
  ) {
    const user: any = req.user;
    const getUserInfo = await this.userService.findOneModule(user.userId);

    if (getUserInfo.data.permissionsData.salesOrders.CAN_READ) {
      const result = await this.ordersService.findManyModuleAll(
        user.userId,
        user.roles[0],
        getUserInfo.data.userLinkToProfileId,
        page,
        count,
        search || null,
        selectedDistributorProfileId,
        // fromProfileApproval, managerApprovalGenerateDC, salesOfficerApprovalStatus, toProfileConfirmation,
        managerFinalApproval,
        pendingApprovalMyEnd,
        typeOfSale,
        dateFrom,
        dateTo,
        // orderInProcess, completedOrders
      );
      res.status(HttpStatus.OK).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: IOrderMessage.failedUnauthorisedAccessFind,
      });
    }
  }



  

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('get-last-lot-sale-price/:lotId/:distributorId')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: IOrderfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    type: IModuleRes,
    description: 'Internal Server Error',
  })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findLotById(@Param('lotId') lotId: string, @Param('distributorId') distributorId: any, @Res() res: Response, @Req() req: Request,
  ) {
    const user: any = req.user;
    const getUserInfo = await this.userService.findOneModule(user.userId);
    if (getUserInfo.data.permissionsData.salesOrders.CAN_READ) {
      const result = await this.ordersService.findPreviousSalePriceOfLot(lotId, distributorId);
      res.status(HttpStatus.OK).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: IOrderMessage.failedUnauthorisedAccessFind,
      });
    }
  }













////////approvals and rejects
// stage 1 from profile
@UseGuards(AuthGuard('JWTaccessToken'))
@Get("fromProfileApprove/:id")
@ApiBearerAuth('JWT_TOKNE')
// @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
// @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
// @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
// @ApiRequestTimeoutResponse({description: 'Time Out'})
async fromProfileApproveTxn(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.fromProfileApprove(id);
        res.status(HttpStatus.OK).send(result);
}

@UseGuards(AuthGuard('JWTaccessToken'))
@Get("fromProfileReject/:id")
@ApiBearerAuth('JWT_TOKNE')
async fromProfileRejectTxn(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.fromProfileReject(id);
        res.status(HttpStatus.OK).send(result);
}



// stage 2 manager approve DC
@UseGuards(AuthGuard('JWTaccessToken'))
@Get("managerApprovalDC/:id")
@ApiBearerAuth('JWT_TOKNE')
async managerApprovalDC(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.managerApprovalDC(id);
        res.status(HttpStatus.OK).send(result);
}

@UseGuards(AuthGuard('JWTaccessToken'))
@Get("managerRejectDC/:id")
@ApiBearerAuth('JWT_TOKNE')
async managerRejectDC(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.managerRejectDC(id);
        res.status(HttpStatus.OK).send(result);
}

// stage 3 confirmation from sales officer



//stage 4 confirmation from to profile
@UseGuards(AuthGuard('JWTaccessToken'))
@Get("receipentProfileConfirmation/:id")
@ApiBearerAuth('JWT_TOKNE')
async toProfileConfirmTxn(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.toProfileConfirmTxn(id);
        res.status(HttpStatus.OK).send(result);
}

@UseGuards(AuthGuard('JWTaccessToken'))
@Get("receipentProfileReject/:id")
@ApiBearerAuth('JWT_TOKNE')
async toProfileRejectTxn(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.toProfileRejectTxn(id);
        res.status(HttpStatus.OK).send(result);
}


//stage 5 manager generate and complete txn
@UseGuards(AuthGuard('JWTaccessToken'))
@Get("managerCompleteTxnorders/:id/:orderType")
@ApiBearerAuth('JWT_TOKNE')
async managerCompleteTxn(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Param('orderType') orderType: string ) {
if(orderType === TypeOfSale.COMPANY_SALE) {
  let result = await this.ordersService.managerCompleteTxnSale(id);
  res.status(HttpStatus.OK).send(result);
} else if(orderType === TypeOfSale.IPT) {
  let result = await this.ordersService.managerCompleteTxnIPT(id);
  res.status(HttpStatus.OK).send(result);
} else if(orderType === TypeOfSale.SALES_RETURN) {
  let result = await this.ordersService.managerCompleteTxnSalesReturn(id);
  res.status(HttpStatus.OK).send(result);
} else {
  return res.status(HttpStatus.BAD_REQUEST).send({
    status: false,
    message: IOrderMessage.someError,
  });
}  



}

@UseGuards(AuthGuard('JWTaccessToken'))
@Get("managerRejectCompleteTxnOrder/:id")
@ApiBearerAuth('JWT_TOKNE')
async managerRejectFinalTxn(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        let result = await this.ordersService.managerRejectFinalTxn(id);
        res.status(HttpStatus.OK).send(result);
}



@Get("trialPdf")
async generatePdf(@Res() res: Response) {
        // let result = await this.pdfService.generatePDFToS3('123', 'sample2.pdf', {locals: {}} );
        // res.status(HttpStatus.OK).send(result);


        try {
          let result = await this.pdfService.generatePDFToS3('123', 'sample2.pdf', {locals: {}} );
            res.status(HttpStatus.OK).send(result);
        } catch (error) {
          console.log(error)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }

      }




















}
