import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { MovieNotFound } from "src/application/exceptions";
import { IMovie } from "src/domain/entities";
import { IMovieRepository } from "src/infrastructure/interfaces";
import { MovieProviderStrategyFactory } from "src/infrastructure/services";

export class GetMovieDetailsV1 {
  private readonly logger = new Logger(GetMovieDetailsV1.name);

  constructor(
    @Inject(PORT.MovieProviderStrategyFactory) private readonly movieProviderStrategyFactory: MovieProviderStrategyFactory,
    @Inject(PORT.Movie) private readonly movieRepository: IMovieRepository,
  ) {}

  async exec(provider: EMovieProvider, id: string): Promise<IMovie> {
    const strategy = this.movieProviderStrategyFactory.getStrategy(provider);

    let movie = null;

    if (provider !== EMovieProvider.CUSTOM) movie = await this.movieRepository.getFilmFromProvider(provider, strategy.getReference(id));

    if (!Boolean(movie)) movie = await strategy.getFilm(id);
    if (!Boolean(movie)) throw new MovieNotFound();

    return movie;
  }
}
