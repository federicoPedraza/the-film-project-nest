import { HttpException, HttpStatus } from "@nestjs/common";

export abstract class GenericHttpException extends HttpException {
  private readonly code: string;

  constructor(response: string | object, status: HttpStatus, code: string) {
    super(response, status);
    this.code = code;
  }

  getBody() {
    const baseHttpException = new HttpException("", HttpStatus.INTERNAL_SERVER_ERROR);
    const baseProperties = new Set(Object.keys(baseHttpException));

    return Object.entries(this).reduce((obj, [key, value]) => {
      if (!baseProperties.has(key) && typeof value !== "function") {
        obj[key] = value;
      }
      return obj;
    }, {});
  }
}
