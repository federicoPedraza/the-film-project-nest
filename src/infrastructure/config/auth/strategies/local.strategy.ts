import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { SignInV1 } from "src/application/use-cases";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private signInUseCase: SignInV1) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    return await this.signInUseCase.validateUser({ email, password });
  }
}
