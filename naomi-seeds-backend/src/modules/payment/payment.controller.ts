import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentDto, PaymentfindOneByIdRes, IPaymentfindManyRes, UpdatePaymentAccountantDto, IPaymentMessage, UpdatePaymentDto } from './payment.dto';
import { PaymentService } from './payment.service';
import { UserService } from '../users/user.service';

@Controller('payment')
@ApiTags('payment')

@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class PaymentController {
    constructor(private paymentService: PaymentService, private userService: UserService,) {}

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post("/create")
    @ApiBearerAuth('JWT_TOKNE')
    @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'}) 
    @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async Create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request, @Res() res: Response) {
            const user: any = req.user;
            createPaymentDto["createdByPersonId"] = user._id;
            createPaymentDto["createdByPersonName"] = `${user.firstName}  ${user.lastName}`;
            const getUserProfileInfo = await this.userService.findOneModule(
                user.userId,
              );
              if (getUserProfileInfo.data.permissionsData.paymentsReceived.CAN_CREATE) {
                const result = await this.paymentService.createModulePayment(createPaymentDto);
                res.status(HttpStatus.CREATED).send(result);
              } else {
                return res.status(HttpStatus.BAD_REQUEST).send({
                  status: false,
                  message: IPaymentMessage.failedUnauthorisedAccessCreate,
                });
              }
            }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put("/update/:paymentId")
    @ApiBearerAuth('JWT_TOKNE')
    @ApiOkResponse({type: IModuleRes,description: 'Update Successfully'})
    @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async update(@Param('paymentId') paymentId: string, @Body() updatePaymentDto: UpdatePaymentDto, @Req() req: Request, @Res() res: Response) {
            const user: any = req.user;
            const getUserProfileInfo = await this.userService.findOneModule(
                user.userId,
              );
              if (getUserProfileInfo.data.permissionsData.paymentsReceived.CAN_EDIT) {
                const result = await this.paymentService.updateModule(paymentId, updatePaymentDto);
                res.status(HttpStatus.OK).send(result);
              } else {
                return res.status(HttpStatus.BAD_REQUEST).send({
                  status: false,
                  message: IPaymentMessage.failedUnauthorisedAccessCreate,
                });
              }
            }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Put("/accountant-update/:paymentId")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: IModuleRes,description: 'Update Successfully'})
//     @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async updateAccountant(@Param('paymentId') paymentId: string, @Body() updatePaymentAccountantDto: UpdatePaymentAccountantDto, @Req() req: Request, @Res() res: Response) {
//             const user: any = req.user;
//             updatePaymentAccountantDto["accountantId"] = user.profileId;
//             updatePaymentAccountantDto["accountantName"] = `${user.firstName}  ${user.lastName}`;

//              if (true) {
//                 const result = await this.paymentService.updateModuleForAccountant(paymentId, updatePaymentAccountantDto);
//                 res.status(HttpStatus.OK).send(result);
//               } else {
//                 return res.status(HttpStatus.BAD_REQUEST).send({
//                   status: false,
//                   message: IPaymentMessage.failedUnauthorisedAccessCreate,
//                 });
//               }
//             }

// //     @UseGuards(AuthGuard('JWTaccessToken'))
// //     @Delete("/delete/:_id")
// //     @ApiBearerAuth('JWT_TOKNE')
// //     @ApiOkResponse({type: IModuleRes,description: 'Deleted Successfully'})
// //     @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
// //     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
// //     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
// //     @ApiRequestTimeoutResponse({description: 'Time Out'})
// //     async delete(@Param('_id') _id: string, @Res() res: Response) {
// //             let result = await this.Service.deleteModule(_id);
// //             res.status(HttpStatus.OK).send(result);
// //     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get("find/:_id")
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({type: PaymentfindOneByIdRes,description: 'Found Successfully'})
//     @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//     @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//     @ApiRequestTimeoutResponse({description: 'Time Out'})
//     async findOneById(@Param('_id') _id: string, @Res() res: Response) {
//             let result = await this.paymentService.findOneModule(_id);
//             res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get('all')
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({ type: IPaymentfindManyRes, description: 'Found Successfully' })
//     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//     @ApiRequestTimeoutResponse({ description: 'Time Out' })
//     async findManyActive(
//       @Res() res: Response,
//       @Query('page') page: number,
//       @Query('count') count: number,
//       @Query('filter') filter: string,
// //       @Query('status') status?: boolean,
// @Query('dateFrom') dateFrom?: Date,
// @Query('dateTo') dateTo?: Date,
//       @Query('distributorId') distributorId?: string,
//       @Query('approvalStatus') approvalStatus?: string,
//     ) {
//         let result = await this.paymentService.findManyModule(page, count, filter || null, dateFrom, dateTo, distributorId, approvalStatus);
//           res.status(HttpStatus.OK).send(result);
//     }

//     @UseGuards(AuthGuard('JWTaccessToken'))
//     @Get('distributor/all/:distributorId')
//     @ApiBearerAuth('JWT_TOKNE')
//     @ApiOkResponse({ type: IPaymentfindManyRes, description: 'Found Successfully' })
//     @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//     @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//     @ApiRequestTimeoutResponse({ description: 'Time Out' })
//     async findManyDistributer(
//       @Res() res: Response,
//       @Param('distributorId') distributorId: string,
//       @Query('page') page: number,
//       @Query('count') count: number,
//       @Query('filter') filter: string,
//       @Query('dateFrom') dateFrom?: Date,
// @Query('dateTo') dateTo?: Date,
// //       @Query('status') status?: boolean,
//     ) {
//         let result = await this.paymentService.findManyModule(page, count, filter || null, dateFrom, dateTo, distributorId);
//           res.status(HttpStatus.OK).send(result);
//     }



// //accountant
// @UseGuards(AuthGuard('JWTaccessToken'))
// @Get("reject-payment-accountant/:_id")
// @ApiBearerAuth('JWT_TOKNE')
// @ApiOkResponse({type: PaymentfindOneByIdRes,description: 'Found Successfully'})
// @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
// @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
// @ApiRequestTimeoutResponse({description: 'Time Out'})
// async accountantRejectPayment(@Param('_id') _id: string, @Res() res: Response) {
//         let result = await this.paymentService.rejectPayment(_id);
//         res.status(HttpStatus.OK).send(result);
// }



}
