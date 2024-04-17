import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Inject, Injectable } from "@nestjs/common";

import { InvalidToken } from "src/application/exceptions";
import { PORT } from "src/application/enums";
import { Observable } from "rxjs";
import { IRedisRepository } from "src/infrastructure/interfaces";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(@Inject(PORT.Redis) private readonly redisRepository: IRedisRepository) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
    return super.canActivate(context);
  }

  // @ts-expect-error: Unreachable code error
  async handleRequest(err, user) {
    if (err || !user) throw err || new InvalidToken();

    const updatedUser = await this.redisRepository.get(user["_id"]);
    if (!Boolean(updatedUser)) throw new InvalidToken();

    return updatedUser;
  }
}
