import { Module } from "@nestjs/common";
import { AppController } from "./infrastructure/controllers";
import { ConfigModule } from "@nestjs/config";
import * as Config from "./infrastructure/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true }), Config.MongoDBModule],
  controllers: [AppController],
})
export class AppModule {}
