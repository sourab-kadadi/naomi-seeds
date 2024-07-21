import { Response, Request } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, Query, UseFilters, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { DropDownsService } from './drop-downs.service';
import { IModuleRes } from '../../common.service';
import { CreateDropDownsGeneralDto, UpdateDropDownsGeneralDto, DropDownfindOneByIdRes, IDropDownfindManyRes, dropDownCategory } from './drop-downs.dto';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { RoleUpdated } from '../users/user-role.enum';

@ApiTags('drop-downs')
@Controller('drop-downs')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class DropDownsController {
  constructor(private Service: DropDownsService) { }

  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('/create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() createDropDownsGeneralDto: CreateDropDownsGeneralDto, @Res() Res: Response) {
    let result = await this.Service.createModule(createDropDownsGeneralDto);
    Res.status(HttpStatus.CREATED).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('/update/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() UpdateDropDownsGeneralDto: UpdateDropDownsGeneralDto, @Res() Res: Response) {
    let result = await this.Service.updateModule(_id, UpdateDropDownsGeneralDto);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Delete('/delete/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async delete(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.Service.deleteModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find/:_id')
  @ApiOkResponse({ type: DropDownfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.Service.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('activePaymentsBusinessCategory/all')
  @ApiOkResponse({ type: IDropDownfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
  })
  async findManyActivePaymentsCategory(
    @Res() Res: Response,
    @Query('filter') filter: string,
    @Query('status') status?: string,
  ) {
    const dropDownFor = dropDownCategory.PAYMENTS_RECEIVED_CATEGORIZATION;
    let result = await this.Service.findManyModule(dropDownFor, null, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }



  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('activeLedgerDistributorCategory/all')
  @ApiOkResponse({ type: IDropDownfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
  })
  async findManyLedgerDistributorCategory(
    @Res() Res: Response,
    @Query('filter') filter: string,
    @Query('status') status?: string,
  ) {
    const dropDownFor = dropDownCategory.LEDGER_DISTRIBUTOR;
    let result = await this.Service.findManyModule(dropDownFor, null, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('activeZones/all')
    @ApiOkResponse({ type: IDropDownfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    @ApiQuery({
      name: 'filter',
      type: String,
      required: false,
    })
    async findManyZones(
      @Res() Res: Response,
      @Query('filter') filter: string,
      @Query('status') status?: string,
    ) {
      const dropDownFor = dropDownCategory.ZONE;
      let result = await this.Service.findManyModule(dropDownFor, null, filter, true);
      Res.status(HttpStatus.OK).send(result);
    }

  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('activeStates/all')
  @ApiOkResponse({ type: IDropDownfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  @ApiQuery({
    name: 'filter',
    type: String,
    required: false,
  })
  async findManyStates(
    @Res() Res: Response,
    @Query('filter') filter: string,
    @Query('status') status?: string,
  ) {
    const dropDownFor = dropDownCategory.STATE;
    let result = await this.Service.findManyModule(dropDownFor, null, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('activeDistricts-based-on-state/all/:state')
  @ApiOkResponse({ type: IDropDownfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
  })
  async findManyDistricts(
    @Res() Res: Response,
    @Req() Req: Request,
    @Query('filter') filter: string,
    @Param('state') parentDropdownName?: string,
    // @Query('status') status?: string,
  ) {
    const dropDownFor = dropDownCategory.DISTRICT;
    // let user :any = Req.user;
    // const status = (user.roles[0] === RoleUpdated.ADMIN) ? false : true;
    let result = await this.Service.findManyModule(dropDownFor, parentDropdownName || null, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }













}
