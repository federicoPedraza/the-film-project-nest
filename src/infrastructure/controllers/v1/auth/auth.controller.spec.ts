/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from "@nestjs/testing";
import { AuthControllerV1 } from "./auth.controller";
import { PORT } from "src/application/enums";
import { RedisRepository, UserRepository } from "src/infrastructure/repositories";
import { BcryptService, JWTModule, JwtStrategy, LocalStrategy } from "src/infrastructure/config";
import * as UseCase from "src/application/use-cases";
import { SignupDTO } from "src/application/dtos";
import { HttpStatus } from "@nestjs/common";
import { AppModule } from "src/app.module";
import { MongooseModule } from "@nestjs/mongoose";
import { IUser, User, UserSchema } from "src/domain/entities";
import { PassportModule } from "@nestjs/passport";
import { FilterQuery } from "src/infrastructure/interfaces";

describe(AuthControllerV1.name, () => {
  let controller: AuthControllerV1;
  const responseMock = {
    status: jest.fn(_ => ({
      send: jest.fn(y => y),
    })),
    send: jest.fn(x => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PassportModule.register({ session: true })],
      controllers: [AuthControllerV1],
      providers: [
        UseCase.SignUpV1,
        UseCase.SignInV1,
        BcryptService,
        JWTModule,
        LocalStrategy,
        JwtStrategy,
        {
          provide: PORT.User,
          useValue: {
            findOne: jest.fn().mockImplementation((filter: FilterQuery<IUser>) => {
              return {
                email: "test@mail.com",
              };
            }),
          },
        },
        { provide: PORT.Redis, useClass: RedisRepository },
      ],
    }).compile();

    controller = module.get<AuthControllerV1>(AuthControllerV1);
  });

  describe("Should sign-up", () => {
    it("should return token", () => {
      const signupMock: SignupDTO = {
        email: "test@test.com",
        password: "Password1?",
      };

      controller.signup(signupMock);
      expect(controller.signup).toHaveBeenCalled();
    });
  });
});
