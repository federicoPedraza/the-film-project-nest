import { Global, Module } from "@nestjs/common";

import { AccessControlService } from "./access-control.service";

@Global()
@Module({
  imports: [],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
