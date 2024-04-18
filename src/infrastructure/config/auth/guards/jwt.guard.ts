import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";

import { InvalidToken } from "src/application/exceptions";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
    return super.canActivate(context);
  }

  // @ts-expect-error: Unreachable code error
  async handleRequest(err, user) {
    if (err || !user) throw err || new InvalidToken();

    return user;
  }
}
