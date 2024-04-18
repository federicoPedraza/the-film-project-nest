import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { MovieNotFound } from "src/application/exceptions";
import { IMovieRepository } from "src/infrastructure/interfaces";
import { MovieProviderStrategyFactory } from "src/infrastructure/services";

export class DeleteMovieV1 {
  private readonly logger = new Logger(DeleteMovieV1.name);

  constructor(
    @Inject(PORT.MovieProviderStrategyFactory) private readonly movieProviderStrategyFactory: MovieProviderStrategyFactory,
    @Inject(PORT.Movie) private readonly movieRepository: IMovieRepository,
  ) {}

  async exec(reference: string, provider: EMovieProvider) {
    const strategy = this.movieProviderStrategyFactory.getStrategy(provider);

    const movie = await strategy.getFilm(reference);

    if (!Boolean(movie)) throw new MovieNotFound();

    if (provider === EMovieProvider.CUSTOM) await this.deleteCustomMovie(reference);
    else await this.deleteNonCustomMovie(strategy.getReference(reference));
  }

  private async deleteCustomMovie(id: string) {
    await this.movieRepository.delete({ query: { _id: id } });
  }

  private async deleteNonCustomMovie(reference: string) {
    await this.movieRepository.delete({ query: { providerReference: reference } });
  }
}
