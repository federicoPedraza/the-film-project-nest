import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { EditMovieDTO, PostMovieDTO } from "src/application/dtos";
import { EMovieProvider } from "src/application/enums";
import { DefaultApiResponse, ListMoviesPresentation, PostMoviePresentation } from "src/application/presentations";
import { DEFAULT_MOVIE_LIST_COUNT, EditMovieV1, GetMovieDetailsV1, ListMoviesV1, PostMovieV1 } from "src/application/use-cases";
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
    private readonly editMovieUseCase: EditMovieV1,
  ) {}

  @Post("/")
  async post(@Body() body: PostMovieDTO, @Request() req): Promise<DefaultApiResponse<PostMoviePresentation>> {
    const movie = await this.postMovieUseCase.exec(body, req.user._id);

    return { message: "Movie posted successfully", info: { id: movie._id }, status: HttpStatus.CREATED };
  }

  @Get("/list")
  async list(@Query("count") count: number, @Query("page") page: number, @Query("provider") provider: EMovieProvider): Promise<DefaultApiResponse<ListMoviesPresentation>> {
    const list = await this.listMoviesUseCase.exec({ count: Boolean(count) ? count : DEFAULT_MOVIE_LIST_COUNT, page: Boolean(page) ? page - 1 : 0, provider });

    return { message: "List of movies returned successfully", info: list, status: HttpStatus.OK };
  }

  @Get("/:provider/:reference")
  async getDetails(@Param("reference") reference: string, @Param("provider") provider: EMovieProvider): Promise<DefaultApiResponse<IMovie>> {
    const details = await this.getMovieDetailsUseCase.exec(provider, reference);

    return { message: "Movie details returned successfully", info: details, status: HttpStatus.OK };
  }

  @Put("/:provider/:reference")
  async updateMovie(@Param("provider") provider: EMovieProvider, @Param("reference") reference: string, @Body() body: EditMovieDTO): Promise<DefaultApiResponse<any>> {
    await this.editMovieUseCase.exec(body, reference, provider);

    return { message: "Movie editted successfully", status: HttpStatus.OK };
  }
}
