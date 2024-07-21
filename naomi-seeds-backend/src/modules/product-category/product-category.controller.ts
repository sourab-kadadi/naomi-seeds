import { Response } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, Query, UseFilters, UseGuards, Req } from '@nestjs/common';
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
import { ProductCategoryService } from './product-category.service';
import { IModuleRes } from '../../common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import {CreateProductCategoryDto, IProductCategoryfindManyRes, ProductCategoryfindOneByIdRes, UpdateProductCategoryDto} from './product-category.dto';

@ApiTags('product-category')
@Controller('product-category')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class ProductCategoryController {
    constructor(private Service: ProductCategoryService) {}

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('/create')
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() createProductCategoryDto: CreateProductCategoryDto, @Res() Res: Response) {
      let result = await this.Service.createModule(createProductCategoryDto);
      Res.status(HttpStatus.CREATED).send(result);
    }
  
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put('/update/:_id')
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async update(@Param('_id') _id: string, @Body() UpdateProductCategoryDto: UpdateProductCategoryDto, @Res() Res: Response) {
      let result = await this.Service.updateModule(_id, UpdateProductCategoryDto);
      Res.status(HttpStatus.OK).send(result);
    }
  
    // @Delete('/delete/:_id')
    // @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
    // @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    // @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    // @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    // @ApiRequestTimeoutResponse({ description: 'Time Out' })
    // async delete(@Param('_id') _id: string, @Res() Res: Response) {
    //   let result = await this.Service.deleteModule(_id);
    //   Res.status(HttpStatus.OK).send(result);
    // }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('find/:_id')
    @ApiOkResponse({ type: ProductCategoryfindOneByIdRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
      let result = await this.Service.findOneModule(_id);
      Res.status(HttpStatus.OK).send(result);
    }
  
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('all')
    @ApiOkResponse({ type: IProductCategoryfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    // @ApiQuery({
    //   name: 'filter',
    //   type: String,
    //   required: false,
    // })
    // @ApiQuery({
    //   name: 'status',
    //   type: String,
    //   required: false,
    // })
    async findManyActive(
      // @Req() Req: Request,
      @Res() Res: Response,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('filter') filter: string,
      @Query('status') status?: any,
    ) {
      // let user = Req.user;
    try {
      let result = await this.Service.findManyModule(page, count, filter, status || true);
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
    @Get('dropdown-all-product-category')
    @ApiOkResponse({ type: IProductCategoryfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findAllDropDownByUserRole( @Res() Res: Response) {
      try {
        let result = await this.Service.findAllProductCategoryDropDown(true);
        if (result.status == true) {
          Res.status(HttpStatus.OK).send(result);
        } else {
          Res.status(HttpStatus.NOT_FOUND).send(result);
        }
      } catch (error) {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
    }
  
  
  
  }
  
