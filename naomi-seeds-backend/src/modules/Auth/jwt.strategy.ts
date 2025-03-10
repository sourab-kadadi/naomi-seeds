import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IjwtTokenSecrate } from 'src/config/configration.dto';
import { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JWTaccessToken') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(Req: Request) => {
        return Req?.headers?.authorization as string;
      }]),
      ignoreExpiration: true,
      secretOrKey: 'asdasd',
    });
  }

  async validate(payload: any, Req: Request) {

    Req.user = payload;
    return payload;
  }
}