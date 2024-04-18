import helmet from "helmet";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { HttpExceptionsFilter } from "./infrastructure/filters";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  app.useGlobalFilters(new HttpExceptionsFilter(httpAdapter, configService));

  const NODE_PORT = configService.get<number>("NODE_PORT");
  const NODE_ENV = configService.get<string>("NODE_ENV");

  await app.listen(NODE_PORT, () => {
    Logger.log(`Server in environment: [${NODE_ENV}]`);
    Logger.log(`API listening on port: [${NODE_PORT}]`);
  });
}
bootstrap();
