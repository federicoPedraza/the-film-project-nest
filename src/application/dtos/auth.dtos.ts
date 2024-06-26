import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { EUserRole } from "src/domain/entities";

export class SignupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// used for jwt-strategy
export class TokenPayloadDTO {
  _id: string;
  role: EUserRole;
  iat?: number;
  exp?: number;
}
