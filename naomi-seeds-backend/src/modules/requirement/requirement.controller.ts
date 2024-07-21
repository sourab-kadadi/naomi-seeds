import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from 'src/common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { RequirementService } from './requirement.service';
import { CreateRequirementDto, IRequirementDatafindManyRes } from './requirement.dto';



@ApiTags('Requirement')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
@Controller('requirement')
export class RequirementController {
    constructor(private Service: RequirementService) { }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('/create')
    @ApiBearerAuth('JWT_TOKNE')
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() requirementDto: CreateRequirementDto, @Req() req: Request, @Res() res: Response) {
      const user: any = req.user;
  
      // const user = {

      //       "firstName": "Gourish",
      //       "lastName": "Bemalgi",
      //       "phoneNo": "9666268384",
      //       "email": "gsbemalgi@naomiseeds.com",
      //       "userId": "629fe7502ec8960873b3ff90",
      //       "profileId": "629fe7502ec8960873b3ff91",
      //       "roles": [
      //         "ADMIN"
      //       ],
      //       "iat": 1660206020484,
      //       "exp": 1660206020484
      // }
      const userName = user.firstName + ''+user.lastName; 
      let result = await this.Service.createModule(requirementDto, user.profileId, userName);
      res.status(HttpStatus.CREATED).send(result);
    }
 
    
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('all')
    @ApiBearerAuth('JWT_TOKNE')
    @ApiOkResponse({ type: IRequirementDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findManyActive(
      @Req() req: Request, 
      @Res() res: Response,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('filter') filter?: string,
      @Query('dispatchedStatus') dispatchedStatus?: any,
      @Param('salesPersonId') salesPersonId?: string,
      @Query('managerId') managerId?: any,
      @Query('toDistributorId') toDistributorId?: any,
      @Query('dateFrom') dateFrom?: Date,
      @Query('dateTo') dateTo?: Date,
      ) {
        const user: any = req.user;
    //     const user = {

    //       "firstName": "Gourish",
    //       "lastName": "Bemalgi",
    //       "phoneNo": "9666268384",
    //       "email": "gsbemalgi@naomiseeds.com",
    //       "userId": "629fe7502ec8960873b3ff90",
    //       "profileId": "629fe7502ec8960873b3ff91",
    //       "roles": [
    //         "ADMIN"
    //       ],
    //       "iat": 1660206020484,
    //       "exp": 1660206020484
    // }

        let result = await this.Service.findManyModule(page, count, user.profileId, user.roles[0], salesPersonId || null, managerId || null, toDistributorId || null, filter || null, dispatchedStatus || null, dateFrom, dateTo);
          res.status(HttpStatus.OK).send(result);
    }


    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('dashboard/totalRequirement')
    // @ApiBearerAuth('JWT_TOKNE')
    // @ApiOkResponse({ type: IInvCNSummaryRes, description: 'Calculated Successfully' })
    // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    // @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async dashboardSummary(
      @Res() res: Response,
      @Req() req: Request,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('filter') filter?: string,
      // @Query('dispatchedStatus') dispatchedStatus?: string,
      // @Param('salesOfficerId') salesOfficerId?: string,
      // @Query('managerId') managerId?: any,
      // @Query('managerId') distributorId?: any,
      @Query('dateFrom') dateFrom?: Date,
      @Query('dateTo') dateTo?: Date,
      ) {
        const user: any = req.user;
        // const profileId = '627d382df7337804d2e709fc';
// const dateFrom = "2022-07-02T00:00:00.000Z";

console.log(filter, 'overview');
// const dateTo = "2022-07-08T00:00:00.000Z";
        let result = await this.Service.dashboardSummaryTotalRequirement(
          page, count, user.profileId, filter, dateFrom, dateTo
          // user.profileId, dispatchedStatus, salesOfficerId || null, managerId || null, distributorId || null, dateFrom, dateTo
          );     
        res.status(HttpStatus.OK).send(result);
    }



}
