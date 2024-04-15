import { Module } from "@nestjs/common";
import { AppController } from "./infrastructure/controllers";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true })],
  controllers: [AppController],
})
export class AppModule {}
