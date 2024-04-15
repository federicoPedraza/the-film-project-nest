import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
        const host: string = configService.get<string>("MONGODB_HOST");
        const user: string = configService.get<string>("MONGODB_USER");
        const pass: string = configService.get<string>("MONGODB_PASS");
        const dbName: string = configService.get<string>("MONGODB_NAME");
        const connect: string = configService.get<string>("MONGODB_CONNECT");

        return {
          uri: `${connect}://${user}:${pass}@${host}`,
          dbName,
        };
      },
    }),
  ],
})
export class MongoDBModule {}
