import { Body, Controller, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { PostMovieDTO } from "src/application/dtos";
import { DefaultApiResponse, PostMoviePresentation } from "src/application/presentations";
import { PostMovieV1 } from "src/application/use-cases";
import { JwtAuthGuard } from "src/infrastructure/config";

@Controller({
  version: "1",
  path: "movies",
})
@UseGuards(JwtAuthGuard)
export class MovieControllerV1 {
  constructor(private readonly postMovieUseCase: PostMovieV1) {}

  @Post("/")
  async post(@Body() body: PostMovieDTO, @Request() req): Promise<DefaultApiResponse<PostMoviePresentation>> {
    const movie = await this.postMovieUseCase.exec(body, req.user._id);

    return { message: "Movie posted successfully", info: { id: movie._id }, status: HttpStatus.CREATED };
  }
}
