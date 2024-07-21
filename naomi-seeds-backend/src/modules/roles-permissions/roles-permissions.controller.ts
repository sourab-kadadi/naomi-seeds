import { Response } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
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
import { IModuleRes } from '../../common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';

import { RolesPermissionsService } from './roles-permissions.service';
import { CreateRolesPermissionsDto, UpdateRolesPermissionsDto, IRolesPermissionsDatafindOneByIdRes, IRolesPermissionsDatafindManyRes, IRoleGroupsDatafindManyRes} from './roles-permissions.dto';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('roles-permissions')
@Controller('roles-permissions')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class RolesPermissionsController {

    constructor(private Service: RolesPermissionsService) {}

    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('/create')
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() createRolesPermissionsDto: CreateRolesPermissionsDto, @Res() Res: Response) {
      console.log(createRolesPermissionsDto);
      let result = await this.Service.createModule(createRolesPermissionsDto);
      Res.status(HttpStatus.CREATED).send(result);
    }
  
    @Put('/update/:_id')
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async update(@Param('_id') _id: string, @Body() updateRolesPermissionsDto: UpdateRolesPermissionsDto, @Res() Res: Response) {
      let result = await this.Service.updateModule(_id, updateRolesPermissionsDto);
      Res.status(HttpStatus.OK).send(result);
    }
  
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
  
    @Get('find/:_id')
    @ApiOkResponse({ type: IRolesPermissionsDatafindOneByIdRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
      let result = await this.Service.findOneModule(_id);
      Res.status(HttpStatus.OK).send(result);
    }
  
    //route used in listing of the role groups in admin panel and add user page
    @Get('active/all')
    @ApiOkResponse({ type: IRolesPermissionsDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    @ApiQuery({
      name: 'filter',
      type: String,
      required: false,
    })
    @ApiQuery({
      name: 'status',
      type: String,
      required: false,
    })
    async findManyActive(
      @Res() Res: Response,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('filter') filter: string,
      @Query('status') status?: string,
    ) {
      let result = await this.Service.findManyModule(page, count, filter, true);
      Res.status(HttpStatus.OK).send(result);
    }
  
    // route is not used
    @Get('all')
    @ApiOkResponse({ type: IRolesPermissionsDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    @ApiQuery({
      name: 'filter',
      type: String,
      required: false,
    })
    async findManyAll(
      @Res() Res: Response,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('filter') filter: string,
    ) {
      let result = await this.Service.findManyModule(page, count, filter);
      Res.status(HttpStatus.OK).send(result);
    }
  
    @Get('drop-down-role-groups/active/all')
    @ApiOkResponse({ type: IRoleGroupsDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findAllDropDown(@Res() Res: Response) {
      try {
        let result = await this.Service.findAllRoleGroupsDropDown(null, true);
        if (result.status == true) {
          Res.status(HttpStatus.OK).send(result);
        } else {
          Res.status(HttpStatus.NOT_FOUND).send(result);
        }
      } catch (error) {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
    }

    @Get('drop-down-role-groups-by-user-types/active/all/:userType')
    @ApiOkResponse({ type: IRoleGroupsDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findAllDropDownByUserType(@Param('userType') userType: string,  @Res() Res: Response) {
      try {
        let result = await this.Service.findAllRoleGroupsDropDown(userType, false, true);
        if (result.status == true) {
          Res.status(HttpStatus.OK).send(result);
        } else {
          Res.status(HttpStatus.NOT_FOUND).send(result);
        }
      } catch (error) {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
    }

    @Get('drop-down-role-groups-by-user-types/active/all/with-permissions-data/:userType')
    @ApiOkResponse({ type: IRoleGroupsDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findAllDropDownByUserTypeWithPermissions(@Param('userType') userType: string,  @Res() Res: Response) {
      try {
        let result = await this.Service.findAllRoleGroupsDropDown(userType, true, true);
        if (result.status == true) {
          Res.status(HttpStatus.OK).send(result);
        } else {
          Res.status(HttpStatus.NOT_FOUND).send(result);
        }
      } catch (error) {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
    }
    
    @Get('role-by-seniority-level/:roleSeniorityLevel')
    @ApiOkResponse({ type: IRoleGroupsDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findRoleSeniorityLevel(@Res() Res: Response, @Param('roleSeniorityLevel') roleSeniorityLevel: Number) {
      try {
        console.log(roleSeniorityLevel)
        let result = await this.Service.findRoleBySeniorityLevel(roleSeniorityLevel);
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
  

