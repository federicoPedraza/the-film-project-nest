import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import * as UseCase from "src/application/use-cases";
import { SignupDTO } from "src/application/dtos";
import { DefaultApiResponse } from "src/application/presentations";
import { AuthControllerV1 } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { EUserRole, EUserStatus, User, UserSchema } from "src/domain/entities";
import { ConfigModule } from "@nestjs/config";
import * as Config from "src/infrastructure/config";
import * as Repository from "src/infrastructure/repositories";
import { PORT } from "src/application/enums";
import { UserAlreadyExists } from "src/application/exceptions";
import { Types } from "mongoose";

describe(AuthControllerV1.name, () => {
  let controller: AuthControllerV1;
  let signupUseCase: UseCase.SignUpV1;
  let signinUseCase: UseCase.SignInV1;
  let userRepository: Repository.UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule.register({ session: true }),
        ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true }),
        Config.AccessControlModule,
        Config.JWTModule,
        Config.MongoDBModule,
        Config.BcryptModule,
      ],
      controllers: [AuthControllerV1],
      providers: [
        UseCase.SignUpV1,
        UseCase.SignInV1,
        {
          provide: PORT.User,
          useValue: {
            create: jest.fn().mockReturnValue({ _id: "id" }),
            findOne: jest.fn(),
          },
        },
        {
          provide: Config.LocalAuthGuard,
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();

    controller = module.get<AuthControllerV1>(AuthControllerV1);
    signupUseCase = module.get<UseCase.SignUpV1>(UseCase.SignUpV1);
    signinUseCase = module.get<UseCase.SignInV1>(UseCase.SignInV1);
    userRepository = module.get<Repository.UserRepository>(PORT.User);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signup", () => {
    const signupData: SignupDTO = {
      email: "test@example.com",
      password: "password",
    };

    it("should call UserRepository create method after successful sign-up", async () => {
      const expectedResult: DefaultApiResponse<any> = {
        message: "Sign-up successful",
        status: HttpStatus.CREATED,
      };

      jest.spyOn(signupUseCase, "exec");
      jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);
      const createSpy = jest.spyOn(userRepository, "create");

      const result = await controller.signup(signupData);

      expect(result).toEqual(expectedResult);
      expect(signupUseCase.exec).toHaveBeenCalledWith(signupData);
      expect(createSpy).toHaveBeenCalled();
    });

    it("sign-up should NOT be successful if there's a duplicate", async () => {
      jest.spyOn(userRepository, "findOne").mockReturnValue(undefined);

      jest.spyOn(signupUseCase, "exec");
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockedUser);

      await expect(controller.signup(signupData)).rejects.toThrow(UserAlreadyExists);
    });
  });

  describe("signin", () => {
    it("should return token after successful sign-in", async () => {
      const req = { user: mockedUser };

      jest.spyOn(signinUseCase, "exec");
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockedUser);

      const result = await controller.signin(req);

      expect(result.info.token).toBeDefined();
      expect(signinUseCase.exec).toHaveBeenCalledWith(mockedUser);
    });

    it("should NOT return token after invalid sign-in", async () => {
      const req = { user: { _id: "" } };

      jest.spyOn(signinUseCase, "exec");
      jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);

      const result = await controller.signin(req);

      expect(result.info.status).toBeUndefined();
      expect(signinUseCase.exec).toHaveBeenCalledWith({ _id: "" });
    });
  });
});

const mockedUser = {
  _id: new Types.ObjectId("661e6abc3810b5d1ba2432d2"),
  email: "test@example.com",
  password: "$2b$10$rIlEvHk9mIlPD7kixT3SP.62X.jAsXWPRranBhJ6.UuLKMiirQu0e",
  status: EUserStatus.ACTIVE,
  role: EUserRole.REGULAR,
} as User;
