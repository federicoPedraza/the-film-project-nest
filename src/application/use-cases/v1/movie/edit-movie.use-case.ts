import { Inject, Logger } from "@nestjs/common";
import { EditMovieDTO } from "src/application/dtos";
import { EMovieProvider, PORT } from "src/application/enums";
import { MovieNotFound } from "src/application/exceptions";
import { IMovieRepository } from "src/infrastructure/interfaces";
import { MovieProviderStrategyFactory } from "src/infrastructure/services";

export class EditMovieV1 {
  private readonly logger = new Logger(EditMovieV1.name);

  constructor(
    @Inject(PORT.MovieProviderStrategyFactory) private readonly movieProviderStrategyFactory: MovieProviderStrategyFactory,
    @Inject(PORT.Movie) private readonly movieRepository: IMovieRepository,
  ) {}

  async exec(data: EditMovieDTO, reference: string, provider: EMovieProvider) {
    const strategy = this.movieProviderStrategyFactory.getStrategy(provider);

    const movie = await strategy.getFilm(reference);

    if (!Boolean(movie)) throw new MovieNotFound();

    if (provider === EMovieProvider.CUSTOM) await this.updateCustomMovie(data.providerFields, reference);
    else await this.updateNonCustomMovie(data.providerFields, movie, strategy.getReference(reference));
  }

  private async updateCustomMovie(providerFields: any, id: string) {
    await this.movieRepository.update({ query: { _id: id } }, { ...providerFields });
  }

  private async updateNonCustomMovie(providerFields: any, movie: any, reference: string) {
    await this.movieRepository.update({ query: { providerReference: reference } }, { $set: { ...movie, ...providerFields } });
  }
}
