import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { ListMoviesPresentation, ListedMovieItemPresentation } from "src/application/presentations";
import { IProviderQuery } from "src/infrastructure/interfaces";
import { MovieProviderStrategyFactory } from "src/infrastructure/services";

export const DEFAULT_MOVIE_LIST_COUNT = 6;

export class ListMoviesV1 {
  private readonly logger = new Logger(ListMoviesV1.name);

  constructor(@Inject(PORT.MovieProviderStrategyFactory) private readonly movieProviderStrategyFactory: MovieProviderStrategyFactory) {}

  async exec(query?: IListMovieQuery): Promise<ListMoviesPresentation> {
    const items: ListedMovieItemPresentation[] = await this.getMovies(query);

    return {
      page: query.page,
      items,
      count: items.length,
    };
  }

  private async getMovies(query?: IListMovieQuery): Promise<ListedMovieItemPresentation[]> {
    let items: ListedMovieItemPresentation[] = [];
    const providers = Object.values(EMovieProvider).filter(p => !query.ignoreProviders.includes(p));

    for (const provider of providers) {
      const providerMovies = await this.getMoviesFromProvider(provider, query);
      items = [...items, ...providerMovies];

      if (items.length >= query.count) {
        break;
      }
    }

    return items.slice(0, query.count);
  }

  private async getMoviesFromProvider(provider: EMovieProvider, query?: IListMovieQuery): Promise<ListedMovieItemPresentation[]> {
    const strategy = this.movieProviderStrategyFactory.getStrategy(provider);

    const providerQuery: IProviderQuery = {
      count: query?.count ?? 0,
      skip: query?.page ? query?.page * query?.count : 0,
    };
    const movies = await strategy.getFilms(providerQuery);
    return movies.map(movie => ({
      title: movie.title,
      provider,
    }));
  }
}

export interface IListMovieQuery {
  count: number;
  page: number;
  ignoreProviders: EMovieProvider[];
}
