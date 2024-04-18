import { Injectable, Logger } from "@nestjs/common";
import { UserNotAllowed } from "src/application/exceptions";
import { EUserRole } from "src/domain/entities";

@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  public isRoleAuthorized({ currentRole, requiredRole }: IAuthorizedRoleParams): boolean {
    if (!Boolean(requiredRole) || !Boolean(currentRole)) {
      throw new UserNotAllowed();
    }

    if (requiredRole !== currentRole) throw new UserNotAllowed();

    return true;
  }
}

export interface IAuthorizedRoleParams {
  currentRole: EUserRole;
  requiredRole: EUserRole;
}
