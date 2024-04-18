import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { EUserRole } from "src/domain/entities";
import { ROLE_KEY } from "src/infrastructure/decorators";
import { InvalidToken } from "src/application/exceptions";

import { AccessControlService } from "../../access-control";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();
    const user = request["user"];

    if (!Boolean(user)) throw new InvalidToken();

    if (!Boolean(requiredRoles)) return true;

    for (const requiredRole of requiredRoles) {
      if (
        this.accessControlService.isRoleAuthorized({
          requiredRole,
          currentRole: user.role,
        })
      ) {
        return true;
      }
    }

    return false;
  }
}
