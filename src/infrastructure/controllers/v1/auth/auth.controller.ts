import { Body, Controller, Get, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { SignupDTO } from "src/application/dtos";
import { DefaultApiResponse, SignInPresentation } from "src/application/presentations";
import { SignInV1, SignUpV1 } from "src/application/use-cases";
import { EUserRole } from "src/domain/entities";
import { JwtAuthGuard, LocalAuthGuard, RoleGuard } from "src/infrastructure/config";
import { Roles } from "src/infrastructure/decorators";

@Controller({
  version: "1",
  path: "auth",
})
export class AuthControllerV1 {
  constructor(
    private readonly signupUseCase: SignUpV1,
    private readonly signinUseCase: SignInV1,
  ) {}

  @Post("sign-up")
  async signup(@Body() body: SignupDTO): Promise<DefaultApiResponse<any>> {
    await this.signupUseCase.exec(body);

    return { message: "Sign-up successful", status: HttpStatus.CREATED };
  }

  @Post("sign-in")
  @UseGuards(LocalAuthGuard)
  async signin(@Request() request): Promise<DefaultApiResponse<SignInPresentation>> {
    const info = await this.signinUseCase.exec(request.user);

    return { message: "Sign-in successful", info, status: HttpStatus.OK };
  }

  @Get("/")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.REGULAR)
  async health(): Promise<DefaultApiResponse<any>> {
    return { message: "User logged in", status: HttpStatus.OK };
  }

  @Get("/admin")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.ADMINISTRATOR)
  async healthAdmin(): Promise<DefaultApiResponse<any>> {
    return { message: "User logged in as an admin", status: HttpStatus.OK };
  }
}
