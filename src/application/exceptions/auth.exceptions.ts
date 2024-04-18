import { HttpStatus } from "@nestjs/common";
import { GenericHttpException } from "./commons.exceptions";

export class InvalidToken extends GenericHttpException {
  constructor() {
    super("Invalid token", HttpStatus.UNAUTHORIZED, "INVALID_TOKEN");
  }
}

export class UserAlreadyExists extends GenericHttpException {
  constructor() {
    super("Another user is already registered with the same email address.", HttpStatus.UNAUTHORIZED, "USER_ALREADY_EXISTS");
  }
}

export class InvalidCredentials extends GenericHttpException {
  constructor() {
    super("Invalid credentials", HttpStatus.BAD_REQUEST, "INVALID_CREDENTIALS");
  }
}

export class UserNotFound extends GenericHttpException {
  constructor() {
    super("User not found.", HttpStatus.NOT_FOUND, "USER_NOT_FOUND");
  }
}

export class UserNotAllowed extends GenericHttpException {
  constructor() {
    super("User is not allowed to access this resource.", HttpStatus.UNAUTHORIZED, "USER_NOT_ALLOWED");
  }
}
