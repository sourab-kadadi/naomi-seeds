import { Controller, Get, Post, Body, HttpStatus, Res, UseGuards, Req, UnauthorizedException, Put, UseFilters, Param, Query } from '@nestjs/common';
import {UserDto, LoginDto, IRenewRefreshToken, UpdateUserDto, EmailDto} from './user.dto';
import {UserService} from './user.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from '../Auth/local.auth.guard';
import { RedisService } from '../redis/redis.service';
import { LocalClientAuthGuard } from '../Auth/local-client.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { OtpService } from '../otp/otp.service';
import { ResetPasswordDto } from '../otp/otp.dto';
import { ProfileService } from '../profile/profile.service';
import { RoleUpdated } from './user-role.enum';
@Controller("auth")
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class UserController {

    constructor(private readonly userService: UserService, 
        public RedisService: RedisService,
        private otpService: OtpService,
        private profileService: ProfileService,
        ) {}


        // @UseGuards(AuthGuard('JWTaccessToken'))
        @Post("/signUp")
        // @Roles(Role.ADMIN)
        // @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'})
        // @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
        // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
        // @ApiRequestTimeoutResponse({description: 'Time Out'})
        async Create(@Body() userDto: UserDto, @Req() Req: Request, @Res() Res: Response) {
            try {
                let user :any = Req.user;
                // profileDto.userId = user.userId;
                let result = await this.userService.createModule(userDto);
                if(result.status == true) {
                Res.status(HttpStatus.CREATED).send(result);
                } else {
                Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
                }
               } catch (error) {
                Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
               }
        }













    @UseGuards(LocalAuthGuard)
    @Post("/login")
    async login(@Body() LoginDto: LoginDto, @Res() Res: Response, @Req() Req: Request) {
        try {
         let result = await this.userService.login(LoginDto);
         let token = {
            refresh_token: await this.RedisService.createRefreshToken(result.refreshToken.token, result.payload, Req),
            access_token: result.accessToken.token
        };
         Res.setHeader('Set-Cookie', [result.accessToken.cookies, result.refreshToken.cookies]);
         Res.status(HttpStatus.OK).send(token);
        } catch (error) {
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
     }

     @Put('/update/:_id')
    //  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    //  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    //  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    //  @ApiRequestTimeoutResponse({ description: 'Time Out' })
     async update(@Param('_id') _id: string, @Body() updateUser: UpdateUserDto, @Res() Res: Response) {
       let result = await this.userService.updateModule(_id, updateUser);
       Res.status(HttpStatus.OK).send(result);
     }


     @UseGuards(AuthGuard('JWTaccessToken'))
     @Get("find/:_id")
    //  @ApiBearerAuth('JWT_TOKNE')
    //  @ApiOkResponse({type: ProfilefindOneByIdRes,description: 'Found Successfully'})
    //  @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    //  @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    //  @ApiRequestTimeoutResponse({description: 'Time Out'})
     async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
         try {
             let result = await this.userService.findOneModule(_id);
             if(result.status == true) {
             Res.status(HttpStatus.OK).send(result);
             } else {
             Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
             }
            } catch (error) {
             Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
            }
     }





    @UseGuards(AuthGuard('JWTaccessToken'))
    // guard is throwing error and not working check the reason
    @Get('all')
    // @ApiOkResponse({type: ProfilefindManyRes,description: 'Found Successfully'})
    // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    // @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findManyAll(
      @Res() Res: Response,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('filter') filter?: string,
      @Query('role') role?: Role,
      @Query('status') status?: boolean,
    ) {
      let result = await this.userService.findManyModule(page, count, filter || null, role, status);
      Res.status(HttpStatus.OK).send(result);
    }




    //  @UseGuards(LocalClientAuthGuard)
    //  @Post("/login-client")
    //  async loginCandidate(@Body() LoginDto: LoginDto, @Res() Res: Response, @Req() Req: Request) {
    //      try {
    //       let result = await this.userService.login(LoginDto);
    //       let token = {
    //          refresh_token: await this.RedisService.createRefreshToken(result.refreshToken.token, result.payload, Req),
    //          access_token: result.accessToken.token
    //      };
    //       Res.setHeader('Set-Cookie', [result.accessToken.cookies, result.refreshToken.cookies]);
    //       Res.status(HttpStatus.OK).send(token);
    //      } catch (error) {
    //          Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    //      }
    //   }


//     // @UseGuards(AuthGuard('JWTaccessToken'))
//     @Post("/signUp")
//     // @Roles(Role.ADMIN)
//    async signUp(@Body() UserDto: UserDto, @Res() Res: Response) {
//         let result = await this.userService.CreateUser(UserDto);
//         Res.status(HttpStatus.ACCEPTED).send(result);
//     }

    @Post("/renew-token")
    async renewRefreshToken(@Body() renewToken: IRenewRefreshToken, @Res() Res: Response) {
        try {
         let result = await this.RedisService.getValueFromRefreshToken(renewToken.refreshToken);
         if (result) {
            result = JSON.parse(result);
          let accessToken = await this.userService.generateAccessToken(result.payload);
         await this.userService.updateActiveTime(result.userId);
         Res.status(HttpStatus.ACCEPTED).send(accessToken);
         } else {
            throw new UnauthorizedException();
         }
        } catch (error) {
           if (error.status) {
            Res.status(error.status).send(error.response);
           } else {
            Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
           }
        }
     }

    //  @UseGuards(AuthGuard('JWTaccessToken'))
    //  @Put("/candidate/update")
    //  async updateUser(@Body() UpdateUser: UpdateUserDto, @Req() Req: Request, @Res() Res: Response) {
    //      try {
    //       let user :any = Req.user;
    //       let result = await this.userService.updateUser(user.userId, UpdateUser);
    //       Res.status(HttpStatus.ACCEPTED).send(result);
    //      } catch (error) {
    //       Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    //      }
    //   }

    // @UseGuards(AuthGuard('JWTaccessToken'))
    //  @Put("/partner/update")
    //  async updateCompany(@Body() UpdateUser: UpdateUserDto, @Req() Req: Request, @Res() Res: Response) {
    //      try {
    //       let user :any = Req.user;
    //       let result = await this.userService.updateUser(user.userId, UpdateUser);
    //       Res.status(HttpStatus.ACCEPTED).send(result);
    //      } catch (error) {
    //       Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    //      }
    //   }

    //   @UseGuards(AuthGuard('JWTaccessToken'))
    //   @Get("/user")
    //   async userById(@Req() Req: Request, @Res() Res: Response) {
    //        let user :any = Req.user;
    //        let result = await this.userService.findUserById(user.userId);
    //        Res.status(HttpStatus.ACCEPTED).send(result);
    //    }


// forgot password and password reset
    @Post("/forgot-password")
   async forgotPassword(@Body() email: EmailDto, @Res() Res: Response, @Req() Req: Request) {
        let result = await this.userService.forgotPassword(email);
        Res.status(HttpStatus.ACCEPTED).send(result);
    }

    @Post("/reset-password")
   async verifyOtp(@Body() resetPasswordDto: ResetPasswordDto, @Res() Res: Response, @Req() Req: Request) {
    try {
        let result = await this.otpService.verifyOtp(resetPasswordDto);
        if(result.status == false) {
            Res.status(HttpStatus.ACCEPTED).send(result);
        } else if(result.data.verified && result.data.verified == true) {
            let updatedResult = await this.userService.resetPassword(resetPasswordDto, result.data.userId);
            Res.status(HttpStatus.ACCEPTED).send(updatedResult);            
        } 
    } catch (error) {
        if (error.status) {
         Res.status(error.status).send(error.response);
        } else {
         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
     }
 }    



 @UseGuards(AuthGuard('JWTaccessToken'))
 @Get('user-permissions/:pageLocation?')
//  @ApiBearerAuth('JWT_TOKNE')
//  @ApiOkResponse({type: ProfilefindOneByIdRes,description: 'Found Successfully'})
//  @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
//  @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
//  @ApiRequestTimeoutResponse({description: 'Time Out'})
 async findMyProfilePermissions( @Req() req: Request, @Res() res: Response, @Param('pageLocation') pageLocation: string) {
     try {
         let user :any = req.user;
         let result = await this.userService.findOneModuleByUserPermissions(user.userId, pageLocation);
         if(result.status == true) {
         res.status(HttpStatus.OK).send(result);
         } else {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
         }
        } catch (error) {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
 }
 }


 @UseGuards(AuthGuard('JWTaccessToken'))
 @Get('dropdown-all-user-active/:userRole')
//  @ApiOkResponse({ type: ProfilefindManyRes, description: 'Found Successfully' })
//  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//  @ApiRequestTimeoutResponse({ description: 'Time Out' })
 async findAllDropDownByUserRole(@Param('userRole') userRole: RoleUpdated,  @Res() Res: Response) {
   try {
     let result = await this.userService.findAllUserRoleDropDown(userRole, true);
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