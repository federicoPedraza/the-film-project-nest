import { Global, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Global()
@Module({
  providers: [
    {
      provide: "REDIS",
      useFactory: (configService: ConfigService) => {
        const logger: Logger = new Logger("RedisModule");

        const redis = new Redis({
          port: parseInt(configService.get<string>("REDIS_PORT")),
          host: configService.get<string>("REDIS_HOST"),
          db: 0,
        });

        redis.addListener("connect", () => {
          logger.log("Redis connected");
        });

        redis.addListener("error", error => {
          logger.error("Redis error", error);
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ["REDIS"],
})
export class RedisModule {}
