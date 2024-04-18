import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { ListMoviesPresentation, ListedMovieItemPresentation } from "src/application/presentations";
import { IMovieRepository, IProviderQuery, ProviderType } from "src/infrastructure/interfaces";
import { MovieProviderStrategyFactory } from "src/infrastructure/services";

export const DEFAULT_MOVIE_LIST_COUNT = 6;

export class ListMoviesV1 {
  private readonly logger = new Logger(ListMoviesV1.name);

  constructor(
    @Inject(PORT.MovieProviderStrategyFactory) private readonly movieProviderStrategyFactory: MovieProviderStrategyFactory,
    @Inject(PORT.Movie) private readonly movieRepository: IMovieRepository,
  ) {}

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
    let providers = Object.values(EMovieProvider);

    if (Boolean(query.provider)) providers = providers.filter(p => query.provider.includes(p));

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
      // we want to propagate errors if the user is searching for that specific provider and we can't supply films
      propagateErrors: Boolean(query?.provider),
    };

    const movies = await strategy.getFilms(providerQuery);

    if (provider !== EMovieProvider.CUSTOM) {
      const mockedMovies = await this.movieRepository.getFilmsFromProvider(provider, providerQuery);
      const mockedMoviesByReference = this.getMockedMoviesByReference(mockedMovies);

      return movies.map(movie => {
        const mockedMovie = mockedMoviesByReference[movie.providerReference];
        return {
          title: mockedMovie?.title || movie.title,
          provider,
        };
      });
    }

    return movies.map(movie => ({
      title: movie.title,
      provider,
    }));
  }

  private getMockedMoviesByReference(movies: ProviderType[]): { [key: string]: ProviderType } {
    return movies.reduce((acc, movie) => {
      acc[movie.providerReference] = movie;
      return acc;
    }, {});
  }
}

export interface IListMovieQuery {
  count: number;
  page: number;
  provider: EMovieProvider;
}
