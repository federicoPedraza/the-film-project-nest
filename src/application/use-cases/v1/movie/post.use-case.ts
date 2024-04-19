import { Inject, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { PostMovieDTO } from "src/application/dtos";
import { EMovieProvider, PORT } from "src/application/enums";
import { IMovie } from "src/domain/entities";
import { IMovieRepository } from "src/infrastructure/interfaces";

export class PostMovieV1 {
  private readonly logger = new Logger(PostMovieV1.name);

  constructor(@Inject(PORT.Movie) private readonly movieRepository: IMovieRepository) {}

  async exec(body: PostMovieDTO, poster: string): Promise<IMovie> {
    const userId = new Types.ObjectId(poster);

    const data: IMovie = {
      director: body.director,
      title: body.title,
      provider: EMovieProvider.CUSTOM,
      metadata: {
        uploadedBy: userId,
      },
    };

    const result = await this.movieRepository.create(data);
    return result;
  }
}
