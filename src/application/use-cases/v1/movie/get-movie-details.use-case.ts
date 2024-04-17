import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { IMovie } from "src/domain/entities";
import { IMovieRepository, IStarwarsRepository } from "src/infrastructure/interfaces";

export class GetMovieDetailsV1 {
  private readonly logger = new Logger(GetMovieDetailsV1.name);

  constructor(
    @Inject(PORT.Movie) private readonly movieRepository: IMovieRepository,
    @Inject(PORT.Starwars) private readonly starwarsRepository: IStarwarsRepository,
  ) {}

  async exec(provider: EMovieProvider, id: string): Promise<IMovie> {
    switch (provider) {
      case EMovieProvider.STARWARS:
        return await this.starwarsRepository.getFilm(id);
      default:
        return await this.movieRepository.findOne({ query: { _id: id } });
    }
  }
}
