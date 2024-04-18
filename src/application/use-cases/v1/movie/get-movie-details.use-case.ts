import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { MovieNotFound } from "src/application/exceptions";
import { IMovie } from "src/domain/entities";
import { MovieProviderStrategyFactory } from "src/infrastructure/services";

export class GetMovieDetailsV1 {
  private readonly logger = new Logger(GetMovieDetailsV1.name);

  constructor(@Inject(PORT.MovieProviderStrategyFactory) private readonly movieProviderStrategyFactory: MovieProviderStrategyFactory) {}

  async exec(provider: EMovieProvider, id: string): Promise<IMovie> {
    const strategy = this.movieProviderStrategyFactory.getStrategy(provider);

    const movie = await strategy.getFilm(id);

    if (!Boolean(movie)) throw new MovieNotFound();

    return movie;
  }
}
