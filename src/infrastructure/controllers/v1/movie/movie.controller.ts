import { Body, Controller, Get, HttpStatus, Post, Query, Request, UseGuards } from "@nestjs/common";
import { PostMovieDTO } from "src/application/dtos";
import { DefaultApiResponse, ListMoviesPresentation, PostMoviePresentation } from "src/application/presentations";
import { ListMoviesV1, PostMovieV1 } from "src/application/use-cases";
import { JwtAuthGuard } from "src/infrastructure/config";

@Controller({
  version: "1",
  path: "movies",
})
@UseGuards(JwtAuthGuard)
export class MovieControllerV1 {
  constructor(
    private readonly postMovieUseCase: PostMovieV1,
    private readonly listMoviesUseCase: ListMoviesV1,
  ) {}

  @Post("/")
  async post(@Body() body: PostMovieDTO, @Request() req): Promise<DefaultApiResponse<PostMoviePresentation>> {
    const movie = await this.postMovieUseCase.exec(body, req.user._id);

    return { message: "Movie posted successfully", info: { id: movie._id }, status: HttpStatus.CREATED };
  }

  @Get("/list")
  async list(@Query("count") count: number, @Query("skip") skip: number): Promise<DefaultApiResponse<ListMoviesPresentation>> {
    const list = await this.listMoviesUseCase.exec({ count, skip, ignoreProviders: [] });

    return { message: "List of movies returned successfully", info: list, status: HttpStatus.OK };
  }
}
