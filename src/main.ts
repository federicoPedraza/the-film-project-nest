import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const NODE_PORT = configService.get<number>("NODE_PORT");
  const NODE_ENV = configService.get<string>("NODE_ENV");

  await app.listen(NODE_PORT, () => {
    Logger.log(`Server in environment: [${NODE_ENV}]`);
    Logger.log(`API listening on port: [${NODE_PORT}]`);
  });
}
bootstrap();
