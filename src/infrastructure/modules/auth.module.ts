import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "src/domain/entities";
import { AuthControllerV1 } from "../controllers";
import { RedisRepository, UserRepository } from "../repositories";
import { PORT } from "src/application/enums";
import * as UseCase from "src/application/use-cases";
import { BcryptService } from "../config/bcrypt/bcrypt.service";
import { JwtStrategy, LocalStrategy } from "../config";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PassportModule.register({ session: true })],
  controllers: [AuthControllerV1],
  providers: [
    UseCase.SignUpV1,
    UseCase.SignInV1,
    BcryptService,
    LocalStrategy,
    JwtStrategy,
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Redis, useClass: RedisRepository },
  ],
  exports: [],
})
export class AuthModule {}