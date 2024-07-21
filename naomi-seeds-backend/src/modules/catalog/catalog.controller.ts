import { Response, Request } from 'express';
import { Controller, Post, Body, Res, Req, HttpStatus, Put, Param, Delete, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { IModuleRes } from '../../common.service';
import { CreateCatalogDto, UpdateCatalogDto, CatalogfindOneByIdRes, ICatalogfindManyRes } from './catalog.dto';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { RoleUpdated } from '../users/user-role.enum';
import { UserService } from '../users/user.service';

@ApiTags('Catalog')
@Controller('catalog')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class CatalogController {
  constructor(private Service: CatalogService, private userService: UserService) { }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('/create')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() CreateCatalogDto: CreateCatalogDto, @Res() Res: Response, @Req() Req: Request) {
    // const userRole = Req.user['roles'];
    // if (userRole[0] === RoleUpdated.ADMIN) {
    // throw  
    // }

    let result = await this.Service.createModule(CreateCatalogDto);
    Res.status(HttpStatus.CREATED).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('/update/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() UpdateCatalogDto: UpdateCatalogDto, @Res() Res: Response, @Req() Req: Request) {
    let result = await this.Service.updateModule(_id, UpdateCatalogDto);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Delete('/delete/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async delete(@Param('_id') _id: string, @Res() Res: Response, @Req() Req: Request) {
    let result = await this.Service.deleteModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find/:_id')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: CatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response, @Req() Req: Request,) {
    let result = await this.Service.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('all')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ICatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  @ApiQuery({ name: 'filter', type: String, required: false })
  @ApiQuery({ name: 'status', type: Boolean, required: false })
  async findManyAll(
    @Res() Res: Response,
    @Req() Req: Request,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('filter') filter?: string,
    @Query('productCategoryId') cropId?: string,
  ) {
    const userRole = Req.user['roles'];
    let status = userRole[0] === RoleUpdated.ADMIN ? true : null;
    let result = await this.Service.findManyModule(page, count, filter, cropId, status);
    Res.status(HttpStatus.OK).send(result);
  }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('drop-down-active/all')
  @ApiBearerAuth('JWT_TOKNE')
  @ApiOkResponse({ type: ICatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllDropDown(@Res() Res: Response, @Req() Req: Request,) {
    try {
      let result = await this.Service.findAllCatalogDropDown(true);
        Res.status(HttpStatus.OK).send(result);
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }



}
