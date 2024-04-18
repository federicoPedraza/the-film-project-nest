import { Module } from "@nestjs/common";
import { AppController } from "./infrastructure/controllers";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import * as Config from "./infrastructure/config";
import * as Controller from "./infrastructure/modules";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get("RATE_LIMIT_TTL"),
          limit: config.get("RATE_LIMIT_COUT"),
        },
      ],
    }),
    Config.JWTModule,
    Config.MongoDBModule,
    Config.BcryptModule,
    Controller.AuthModule,
    Controller.MovieModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
