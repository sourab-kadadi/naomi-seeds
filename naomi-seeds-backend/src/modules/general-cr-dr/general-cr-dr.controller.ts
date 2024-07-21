import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { GeneralCrDrService } from './general-cr-dr.service';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { CreateDiscountProductDto, IGenCrDrfindManyRes, IGenCrDrfindOneByIdRes } from './general-cr-dr.dto';

@Controller('general-cr-dr')
@ApiTags('General-cr-dr')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class GeneralCrDrController {
    constructor(private Service: GeneralCrDrService) {}

    ///create discount entry by accountant/////
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post("/create-discount-entry-products")
    @ApiBearerAuth('JWT_TOKNE')
    @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'})
    @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async CreateSalesPM(@Body() createDiscountProductDto: CreateDiscountProductDto, @Req() req: Request, @Res() res: Response) {
            const user: any = req.user;
            let result = await this.Service.createModuleDiscountEntry(createDiscountProductDto, user);
            res.status(HttpStatus.CREATED).send(result);
    }


//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Put("/update/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IModuleRes,description: 'Update Successfully'})
//     @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async update(@Param('_id') _id: string, @Body() updateIptDto: UpdateIptDto, @Req() req: Request, @Res() res: Response) {
//             const user: any = req.user;
//             updateIptDto["salesPersonId"] = user.profileId;
//             updateIptDto["salesPersonName"] = `${user.firstName} ${user.lastName}`;
//             let result = await this.Service.updateModule(_id, updateIptDto);
//             res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Delete("/delete/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IModuleRes,description: 'Deleted Successfully'})
//     @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async delete(@Param('_id') _id: string, @Res() res: Response) {
//             let result = await this.Service.deleteModule(_id);
//             res.status(HttpStatus.OK).send(result);
//     }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("find/:_id")
    @ApiBearerAuth('JWT_TOKNE')
    @ApiOkResponse({type: IGenCrDrfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findOneById(@Param('_id') _id: string, @Res() res: Response) {
            let result = await this.Service.findOneModule(_id);
            res.status(HttpStatus.OK).send(result);
    }


    //     check all for Accountant
@UseGuards(AuthGuard('JWTaccessToken'))
@Get('accountant/all')
@ApiBearerAuth('JWT_TOKNE')
@ApiOkResponse({ type: IGenCrDrfindManyRes, description: 'Found Successfully' })
@ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
@ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
@ApiRequestTimeoutResponse({ description: 'Time Out' })
async findManySalesPM(
  @Res() res: Response,
  @Req() req: Request,
  @Query('page') page: number,
  @Query('count') count: number,
  @Query('filter') filter: string,
  @Query('status') status?: boolean,
  @Query('transactionApproval') transactionApproval?: any,
//   @Query('managerApprovalGenerateDC') managerApprovalGenerateDC?: any,
//   @Query('salesOfficerApprovalStatus') salesOfficerApprovalStatus?: any,
//   @Query('toDistributorConfirmation') toDistributorConfirmation?: any,
//   @Query('managerFinalApproval') managerFinalApproval?: any,
  // @Param('salesPersonId') salesPersonId: string,
  ) {
    const user: any = req.user;
    let result = await this.Service.findManyModuleAccountant(page, count, user || null, filter || null, status);
      res.status(HttpStatus.OK).send(result);
}










//     //     IPT
//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Post("/createIPT")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'})
//     @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async Create(@Body() createIptDto: CreateIptDto, @Req() req: Request, @Res() res: Response) {
//             const user: any = req.user;
//             createIptDto["salesPersonId"] = user.profileId;
//             createIptDto["salesPersonName"] = `${user.firstName} ${user.lastName}`;
//             let result = await this.Service.createModuleIPT(createIptDto);
//             res.status(HttpStatus.CREATED).send(result);
//     }




//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("findByUser/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async findOneByIdAndUser(@Param('_id') _id: string, @Res() res: Response, @Req() req: Request,) {
//         const user: any = req.user;  
//         let result = await this.Service.findOneModuleByUser(_id, user.profileId);
//             res.status(HttpStatus.OK).send(result);
//     }


//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get('all')
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({ type: IIptfindManyRes, description: 'Found Successfully' })
//     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//     @ApiRequestTimeoutResponse({ description: 'Time Out' })
//     async findManyActive(
//       @Res() res: Response,
//       @Query('page') page: number,
//       @Query('count') count: number,
//       @Query('filter') filter?: string,
//       @Query('status') status?: boolean,
//       @Param('salesPersonId') salesPersonId?: string,
//       @Query('fromDistributorApproval') fromDistributorApproval?: any,
//       @Query('managerApprovalGenerateDC') managerApprovalGenerateDC?: any,
//       @Query('salesOfficerApprovalStatus') salesOfficerApprovalStatus?: any,
//       @Query('toDistributorConfirmation') toDistributorConfirmation?: any,
//       @Query('managerFinalApproval') managerFinalApproval?: any,
//       @Query('pendingApproval') pendingApproval?: any,
//       @Query('pendingApprovalsManager') pendingApprovalsManager?: boolean,

//       ) {
//         let result = await this.Service.findManyModule(page, count, filter || null, status, salesPersonId, null, null, fromDistributorApproval, managerApprovalGenerateDC, salesOfficerApprovalStatus, toDistributorConfirmation, managerFinalApproval, pendingApproval, pendingApprovalsManager);
//           res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get('sales/all')
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({ type: IIptfindManyRes, description: 'Found Successfully' })
//     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//     @ApiRequestTimeoutResponse({ description: 'Time Out' })
//     async findManySales(
//       @Res() res: Response,
//       @Req() req: Request,
//       @Query('page') page: number,
//       @Query('count') count: number,
//       @Query('filter') filter: string,
//       @Query('status') status?: boolean,
//       @Query('fromDistributorApproval') fromDistributorApproval?: any,
//       @Query('managerApprovalGenerateDC') managerApprovalGenerateDC?: any,
//       @Query('salesOfficerApprovalStatus') salesOfficerApprovalStatus?: any,
//       @Query('toDistributorConfirmation') toDistributorConfirmation?: any,
//       @Query('managerFinalApproval') managerFinalApproval?: any,
//       // @Param('salesPersonId') salesPersonId: string,
//       ) {
//         const user: any = req.user;

//         let result = await this.Service.findManyModule(page, count, filter || null, status, user.profileId, null, null, fromDistributorApproval, managerApprovalGenerateDC, salesOfficerApprovalStatus, toDistributorConfirmation, managerFinalApproval, null, null);
//           res.status(HttpStatus.OK).send(result);
//     }


//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get('distributor/all')
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({ type: IIptfindManyRes, description: 'Found Successfully' })
//     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//     @ApiRequestTimeoutResponse({ description: 'Time Out' })
//     async findManyDistributor(
//       @Res() res: Response,
//       @Req() req: Request,
//       @Query('page') page: number,
//       @Query('count') count: number,
//       @Query('filter') filter: string,
//       @Query('status') status?: boolean,
//       @Query('fromDistributorApproval') fromDistributorApproval?: any,
//       @Query('managerApprovalGenerateDC') managerApprovalGenerateDC?: any,
//       @Query('salesOfficerApprovalStatus') salesOfficerApprovalStatus?: any,
//       @Query('toDistributorConfirmation') toDistributorConfirmation?: any,
//       @Query('managerFinalApproval') managerFinalApproval?: any,
//       @Query('pendingApproval') pendingApproval?: any,
//       // @Param('salesPersonId') salesPersonId: string,
//       ) {
//         const user: any = req.user;
//         let result = await this.Service.findManyModule(page, count, filter || null, status, null, user.profileId, user.profileId, fromDistributorApproval, managerApprovalGenerateDC, salesOfficerApprovalStatus, toDistributorConfirmation, managerFinalApproval, pendingApproval);
//           res.status(HttpStatus.OK).send(result);
//     }


// // //     @UseGuards(AuthGuard('JWTaccessToken'))
// //     @Get('distributor/all/:distributorId')
// //     @ApiBearerAuth('JWT_TOKNE')
// //     @ApiOkResponse({ type: IIptfindManyRes, description: 'Found Successfully' })
// //     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
// //     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
// //     @ApiRequestTimeoutResponse({ description: 'Time Out' })
// //     async findManyDISTRIBUTOR(
// //       @Res() res: Response,
// //       @Param('distributorId') distributorId: string,
// //       @Query('page') page: number,
// //       @Query('count') count: number,
// //       @Query('filter') filter: string,
// //       @Query('status') status?: boolean,
// //     ) {
// //         let result = await this.Service.findManyModule(page, count, filter || null, status, null, distributorId);
// //           res.status(HttpStatus.OK).send(result);
// //     }


//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("fromDistributorApprove/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async distributorApproveTxn(@Param('_id') _id: string, @Res() res: Response) {
//             let result = await this.Service.fromDistributorApprove(_id);
//             res.status(HttpStatus.OK).send(result);
//     }



//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("managerApprovalDC/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async managerApprovePrimary(@Param('_id') _id: string, @Res() res: Response) {
//             let result = await this.Service.managerApprovalDC(_id);
//             res.status(HttpStatus.OK).send(result);
//     }


    
//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("salesOfficerShippingUpdate/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async salesOfficerShippingUpdate(@Param('_id') _id: string, @Res() res: Response) {
//             let result = await this.Service.salesOfficerShippingUpdate(_id);
//             res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("receipentDistributorConfirmation/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async receipentDistributorConfirmation(@Param('_id') _id: string, @Res() res: Response) {
//             let result = await this.Service.receipentDistributorConfirmation(_id);
//             res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("managerCompleteTxnSalesOrder/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async managerApproveFinal(@Param('_id') _id: string, @Res() res: Response) {
//         let result = await this.Service.managerCompleteTxnSales(_id);
//             res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("managerCompleteTxnIPT/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IptfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async managerApproveFinalIPT(@Param('_id') _id: string, @Res() res: Response) {
//         let result = await this.Service.managerCompleteTxnIPT(_id);
//             res.status(HttpStatus.OK).send(result);
//     }











// //dashboard
// @UseGuards(AuthGuard('JWTaccessToken'))
// @Get('dashboard/distributor/products-purchases')
// @ApiBearerAuth('JWT_TOKNE')
// // @ApiOkResponse({ type: IInvCNSummaryRes, description: 'Calculated Successfully' })
// // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
// // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
// // @ApiRequestTimeoutResponse({ description: 'Time Out' })
// async dashboardSummaryProductsPurchasedDist(
//   @Res() res: Response,
//   @Req() req: Request,
//   @Query('page') page: number,
//   @Query('count') count: number,
//   @Query('filter') filter?: string,
//   @Query('selectionType') selectionType?: string,
//   @Query('dateFrom') dateFrom?: Date,
//   @Query('dateTo') dateTo?: Date,
//   ) {
//     const user: any = req.user;
// // const user = {
// //   "firstName": "karta",
// //   "lastName": "karta",
// //   "phoneNo": "7474785858",
// //   "email": "dist1@gmail.com",
// //   "userId": "631f3fdf8d39cd0379f544c6",
// //   "profileId": "631f3fdf8d39cd0379f544c7",
// //   "roles": [
// //     "DISTRIBUTOR"
// //   ],
// //   "iat": 1667846710183,
// //   "exp": 1667846710183
// // }


// //     const profileId = '627d382df7337804d2e709fc';
// // const dateFrom = "2022-07-02T00:00:00.000Z";
// // const dateTo = "2022-07-08T00:00:00.000Z";

// console.log('here')
//     let result = await this.Service.onDashboardSummaryProductsPurchasedDist(count, page, user, filter || null, selectionType || null, dateFrom, dateTo);     
//     res.status(HttpStatus.OK).send(result);
// }







    
}
