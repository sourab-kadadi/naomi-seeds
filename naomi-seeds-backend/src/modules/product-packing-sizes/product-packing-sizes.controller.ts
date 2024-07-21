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
import { IModuleRes } from '../../common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { RoleUpdated } from '../users/user-role.enum';
import { ProductPackingSizesService } from './product-packing-sizes.service';
import { CreatePackingSizesDto, IProductPackingSizesfindManyRes, ProductPackingSizesfindOneByIdRes, UpdatePackingSizesDto } from './product-packing-sizes.dto';

@Controller('product-packing-sizes')
@ApiTags('product-packing-sizes')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class ProductPackingSizesController {

    constructor(private Service: ProductPackingSizesService) {}

    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('/create')
    @ApiBearerAuth('JWT_TOKNE')
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() createPackingSizesDto: CreatePackingSizesDto, @Res() Res: Response, @Req() Req: Request) {
      // const userRole = Req.user['roles'];
  // if (userRole[0] === RoleUpdated.ADMIN) {
    // throw  
  // }
  
      let result = await this.Service.createModule(createPackingSizesDto);
      Res.status(HttpStatus.CREATED).send(result);
    }
  
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put('/update/:_id')
    @ApiBearerAuth('JWT_TOKNE')
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async update(@Param('_id') _id: string, @Body() UpdatePackingSizesDto: UpdatePackingSizesDto, @Res() Res: Response, @Req() Req: Request) {
      let result = await this.Service.updateModule(_id, UpdatePackingSizesDto);
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
    @ApiOkResponse({ type: ProductPackingSizesfindOneByIdRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findOneById(@Param('_id') _id: string, @Res() Res: Response, @Req() Req: Request,) {
      let result = await this.Service.findOneModule(_id);
      Res.status(HttpStatus.OK).send(result);
    }
  
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('all/:productId')
    @ApiBearerAuth('JWT_TOKNE')
    @ApiOkResponse({ type: IProductPackingSizesfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    @ApiQuery({name: 'filter', type: String, required: false})
    @ApiQuery({name: 'status', type: Boolean, required: false})
    async findManyAll(
      @Res() Res: Response,
      @Req() Req: Request,
      @Param('productId') productId: string,
      ) {
      const userRole = Req.user['roles'];
      let status = userRole[0] !== RoleUpdated.ADMIN ? true : null;
      let result = await this.Service.findManyModule(productId, status);
      Res.status(HttpStatus.OK).send(result);
    }
  
  

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('dropdown-all-packing-size-by-product/:productId')
    @ApiOkResponse({ type: IProductPackingSizesfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findAllDropDownByUserRole( @Res() Res: Response, @Param('productId') productId: string) {
      try {
        let result = await this.Service.findAllDropDown(productId, true);
        // if (result.status == true) {
          Res.status(HttpStatus.OK).send(result);
        // } else {
          // Res.status(HttpStatus.NOT_FOUND).send(result);
        // }
      } catch (error) {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
    }
  
  
  
  
  }
  