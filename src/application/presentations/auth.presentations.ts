import { EUserStatus } from "src/domain/entities";

export class SignInPresentation {
  token: string;
  status: EUserStatus;
}
