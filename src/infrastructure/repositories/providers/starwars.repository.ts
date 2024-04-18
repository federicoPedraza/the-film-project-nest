import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { IProviderQuery, IStarwarsRepository } from "src/infrastructure/interfaces";
import { ConfigService } from "@nestjs/config";
import { catchError, lastValueFrom, map } from "rxjs";
import { IStarwarsMovie } from "src/domain/entities";
import { EMovieProvider } from "src/application/enums";
import { MovieNotFound, ProviderNotAvailable } from "src/application/exceptions";

@Injectable()
export class StarwarsRepository implements IStarwarsRepository {
  private readonly logger: Logger = new Logger(StarwarsRepository.name);
  private STARWARS_BASE_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.STARWARS_BASE_URL = configService.get<string>("STARWARS_BASE_URL");
  }

  async getFilm(id: string): Promise<IStarwarsMovie> {
    const url: string = this.getReference(id);

    const result = await lastValueFrom(
      this.httpService.get(url).pipe(
        map(res => res.data),
        catchError(error => {
          if (error?.response?.status === HttpStatus.NOT_FOUND) throw new MovieNotFound();
          throw new ProviderNotAvailable(EMovieProvider.STARWARS);
        }),
      ),
    );

    return this.map(result);
  }

  async getFilms(query?: IProviderQuery): Promise<IStarwarsMovie[]> {
    const url: string = `${this.STARWARS_BASE_URL}/films`;

    try {
      const result = await lastValueFrom(
        this.httpService.get(url).pipe(
          map(res => res.data.results),
          catchError(() => {
            throw new ProviderNotAvailable(EMovieProvider.STARWARS);
          }),
        ),
      );

      const movies: IStarwarsMovie[] = result.map(movie => {
        return this.map(movie);
      });

      return movies;
    } catch (error) {
      if (error instanceof ProviderNotAvailable) {
        if (!Boolean(query) || query?.propagateErrors) throw error;
        else return [];
      }

      throw error;
    }
  }

  getReference(id: string): string {
    return `${this.STARWARS_BASE_URL}/films/${id}/`;
  }

  map = (movie: any): IStarwarsMovie => {
    return {
      director: movie.director,
      provider: EMovieProvider.STARWARS,
      providerReference: movie.url, // using the unique url from the API has a reference here
      title: movie.title,
      episodeId: movie.episode_id,
      openingCrawl: movie.opening_crawl,
      species: movie.species,
      planets: movie.planets,
      characters: movie.characters,
      starships: movie.starships,
      vehicles: movie.vehicles,
      metadata: undefined,
    };
  };
}
