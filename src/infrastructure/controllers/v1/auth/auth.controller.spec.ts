import { Test, TestingModule } from "@nestjs/testing";
import { AuthControllerV1 } from "./auth.controller";
import * as UseCase from "src/application/use-cases";
import { JwtStrategy, LocalStrategy } from "src/infrastructure/config";
import { BcryptService } from "src/infrastructure/config/bcrypt/bcrypt.service";
import { PORT } from "src/application/enums";
import { UserRepository } from "src/infrastructure/repositories";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import * as Config from "src/infrastructure/config";
import { AccessControlModule } from "src/infrastructure/config/access-control";
import { PassportModule } from "@nestjs/passport";
import { User, UserSchema } from "src/domain/entities";
import { MongooseModule } from "@nestjs/mongoose";

describe(AuthControllerV1.name, () => {
  let authController: AuthControllerV1;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule.register({ session: true }),
        AccessControlModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true }),
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => [
            {
              ttl: config.get("RATE_LIMIT_TTL"),
              limit: config.get("RATE_LIMIT_COUT"),
            },
          ],
        }),
        Config.JWTModule,
        Config.MongoDBModule,
        Config.BcryptModule,
      ],
      controllers: [AuthControllerV1],
      providers: [UseCase.SignUpV1, UseCase.SignInV1, BcryptService, LocalStrategy, JwtStrategy, { provide: PORT.User, useClass: UserRepository }],
    }).compile();

    authController = app.get<AuthControllerV1>(AuthControllerV1);
  });
});
