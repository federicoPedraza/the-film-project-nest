import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
  iat?: number;
  exp?: number;
}
