import { SetMetadata } from "@nestjs/common";

import { EUserRole } from "../../domain/entities";

export const Roles = (...role: EUserRole[]) => SetMetadata(ROLE_KEY, role);

export const ROLE_KEY = "role";
