import { Body, Controller, Get, HttpStatus, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { PostMovieDTO } from "src/application/dtos";
import { EMovieProvider } from "src/application/enums";
import { DefaultApiResponse, ListMoviesPresentation, PostMoviePresentation } from "src/application/presentations";
import { GetMovieDetailsV1, ListMoviesV1, PostMovieV1 } from "src/application/use-cases";
import { IMovie } from "src/domain/entities";
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
    private readonly getMovieDetailsUseCase: GetMovieDetailsV1,
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

  @Get("/:provider/:id")
  async getDetails(@Param("id") movieId: string, @Param("provider") provider: EMovieProvider): Promise<DefaultApiResponse<IMovie>> {
    const details = await this.getMovieDetailsUseCase.exec(provider, movieId);

    return { message: "List of movies returned successfully", info: details, status: HttpStatus.OK };
  }
}
