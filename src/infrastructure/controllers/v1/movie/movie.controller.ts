import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { EditMovieDTO, PostMovieDTO } from "src/application/dtos";
import { EMovieProvider } from "src/application/enums";
import { DefaultApiResponse, ListMoviesPresentation, PostMoviePresentation } from "src/application/presentations";
import { DEFAULT_MOVIE_LIST_COUNT, DeleteMovieV1, EditMovieV1, GetMovieDetailsV1, ListMoviesV1, PostMovieV1 } from "src/application/use-cases";
import { EUserRole, IMovie } from "src/domain/entities";
import { JwtAuthGuard, RoleGuard } from "src/infrastructure/config";
import { Roles } from "src/infrastructure/decorators";

@Controller({
  version: "1",
  path: "movies",
})
@UseGuards(JwtAuthGuard, RoleGuard)
export class MovieControllerV1 {
  constructor(
    private readonly postMovieUseCase: PostMovieV1,
    private readonly listMoviesUseCase: ListMoviesV1,
    private readonly getMovieDetailsUseCase: GetMovieDetailsV1,
    private readonly editMovieUseCase: EditMovieV1,
    private readonly deleteMovieUseCase: DeleteMovieV1,
  ) {}

  @Post("/")
  @Roles(EUserRole.ADMINISTRATOR)
  async post(@Body() body: PostMovieDTO, @Request() req): Promise<DefaultApiResponse<PostMoviePresentation>> {
    const movie = await this.postMovieUseCase.exec(body, req.user._id);

    return { message: "Movie posted successfully", info: { id: movie._id }, status: HttpStatus.CREATED };
  }

  @Get("/list")
  @Roles(EUserRole.REGULAR)
  async list(@Query("count") count: number, @Query("page") page: number, @Query("provider") provider: EMovieProvider): Promise<DefaultApiResponse<ListMoviesPresentation>> {
    const list = await this.listMoviesUseCase.exec({ count: Boolean(count) ? count : DEFAULT_MOVIE_LIST_COUNT, page: Boolean(page) ? page - 1 : 0, provider });

    return { message: "List of movies returned successfully", info: list, status: HttpStatus.OK };
  }

  @Get("/:provider/:reference")
  @Roles(EUserRole.REGULAR)
  async getDetails(@Param("reference") reference: string, @Param("provider") provider: EMovieProvider): Promise<DefaultApiResponse<IMovie>> {
    const details = await this.getMovieDetailsUseCase.exec(provider, reference);

    return { message: "Movie details returned successfully", info: details, status: HttpStatus.OK };
  }

  @Put("/:provider/:reference")
  @Roles(EUserRole.ADMINISTRATOR)
  async updateMovie(@Param("provider") provider: EMovieProvider, @Param("reference") reference: string, @Body() body: EditMovieDTO): Promise<DefaultApiResponse<any>> {
    await this.editMovieUseCase.exec(body, reference, provider);

    return { message: "Movie editted successfully", status: HttpStatus.OK };
  }

  @Delete("/:provider/:reference")
  @Roles(EUserRole.ADMINISTRATOR)
  async deleteMovie(@Param("provider") provider: EMovieProvider, @Param("reference") reference: string): Promise<DefaultApiResponse<any>> {
    await this.deleteMovieUseCase.exec(reference, provider);

    return { message: "Movie deleted successfully", status: HttpStatus.OK };
  }
}
