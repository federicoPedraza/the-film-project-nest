import { Inject, Logger } from "@nestjs/common";
import { PostMovieDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IMovie } from "src/domain/entities";
import { IMovieRepository } from "src/infrastructure/interfaces";

export class PostMovieV1 {
  private readonly logger = new Logger(PostMovieV1.name);

  constructor(@Inject(PORT.Movie) private readonly movieRepository: IMovieRepository) {}

  async exec(data: PostMovieDTO): Promise<IMovie> {
    const movie: IMovie = {
      ...data,
    };

    const result = await this.movieRepository.create(movie);

    return result;
  }
}
