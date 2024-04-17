import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { IStarwarsRepository } from "src/infrastructure/interfaces";
import { ConfigService } from "@nestjs/config";
import { catchError, lastValueFrom, map } from "rxjs";
import { IStarwarsMovie } from "src/domain/entities";
import { EMovieProvider } from "src/application/enums";

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
    const url: string = `${this.STARWARS_BASE_URL}/films/${id}`;

    const result = await lastValueFrom(
      this.httpService.get(url).pipe(
        map(res => res.data),
        catchError(error => {
          throw new Error(error?.status);
        }),
      ),
    );

    return this.map(result);
  }

  async getFilms(): Promise<IStarwarsMovie[]> {
    const url: string = `${this.STARWARS_BASE_URL}/films`;

    const result = await lastValueFrom(
      this.httpService.get(url).pipe(
        map(res => res.data.results),
        catchError(error => {
          throw new Error(error?.status);
        }),
      ),
    );

    const movies: IStarwarsMovie[] = result.map(movie => {
      return this.map(movie);
    });

    return movies;
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
      url: undefined,
    };
  };
}
