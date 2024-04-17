import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { PostMovieDTO } from "src/application/dtos";
import { DefaultApiResponse } from "src/application/presentations";
import { PostMovieV1 } from "src/application/use-cases";
import { IMovie } from "src/domain/entities";

@Controller({
  version: "1",
  path: "movies",
})
export class MovieControllerV1 {
  constructor(private readonly postMovieUseCase: PostMovieV1) {}

  @Post("/")
  async post(@Body() body: PostMovieDTO): Promise<DefaultApiResponse<IMovie>> {
    const movie = await this.postMovieUseCase.exec(body);

    return { message: "Movie posted successfully", info: movie, status: HttpStatus.CREATED };
  }
}
