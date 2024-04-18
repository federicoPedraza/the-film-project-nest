import { HttpAdapterHost } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";

import { GenericHttpException } from "src/application/exceptions";

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly env: string;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {
    this.env = configService.get<string>("NODE_ENV");
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const isGenericHttpException = exception instanceof GenericHttpException;
    const genericHttpException = isGenericHttpException ? exception.getBody() : {};

    const statusCode = isGenericHttpException ? exception?.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpExceptionBody = {
      statusCode,
      message: exception["response"]?.message || exception?.["response"] || exception.message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (this.env === "local") console.log(exception);

    httpAdapter.reply(ctx.getResponse(), { ...genericHttpException, ...httpExceptionBody }, statusCode);
  }
}
