import { HttpStatus } from "@nestjs/common";
import { GenericHttpException } from "./commons.exceptions";
import { EMovieProvider } from "../enums";

export class MovieNotFound extends GenericHttpException {
  constructor() {
    super("Movie not found", HttpStatus.NOT_FOUND, "MOVIE_NOT_FOUND");
  }
}

export class InvalidProvider extends GenericHttpException {
  constructor() {
    super("Specified provider doesn't exists", HttpStatus.BAD_REQUEST, "INVALID_PROVIDER");
  }
}

export class InvalidProviderReference extends GenericHttpException {
  constructor() {
    super("Provider reference is not valid", HttpStatus.BAD_REQUEST, "INVALID_PROVIDER_REFERENCE");
  }
}

export class ProviderNotAvailable extends GenericHttpException {
  constructor(provider: EMovieProvider) {
    super(`${provider} provider is not available, try again later.`, HttpStatus.SERVICE_UNAVAILABLE, "PROVIDER_NOT_AVAILABLE");
  }
}
