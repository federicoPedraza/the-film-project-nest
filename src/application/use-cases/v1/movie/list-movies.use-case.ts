import { Inject, Logger } from "@nestjs/common";
import { EMovieProvider, PORT } from "src/application/enums";
import { ListMoviesPresentation, ListedMovieItemPresentation } from "src/application/presentations";
import { IMovieRepository, IStarwarsRepository } from "src/infrastructure/interfaces";

const DefaultListMovieQuery: IListMovieQuery = {
  count: 6,
  skip: 0,
  ignoreProviders: [],
};

export class ListMoviesV1 {
  private readonly logger = new Logger(ListMoviesV1.name);

  constructor(
    @Inject(PORT.Movie) private readonly movieRepository: IMovieRepository,
    @Inject(PORT.Starwars) private readonly starwarsRepository: IStarwarsRepository,
  ) {}

  async exec(query?: IListMovieQuery): Promise<ListMoviesPresentation> {
    if (!Boolean(query)) query = DefaultListMovieQuery;

    const starwarsMovies = await this.starwarsRepository.getFilms();

    const movies = await this.movieRepository.findAll({
      query: {
        provider: { $nin: query.ignoreProviders },
      },
      skip: query.skip,
      limit: query.count,
    });

    let items: ListedMovieItemPresentation[] = movies.map(movie => {
      return {
        title: movie.title,
        provider: movie.provider,
      };
    });

    if (items.length < query.count) {
      items = [
        ...items,
        ...starwarsMovies.slice(0, query.count - items.length).map(movie => ({
          title: movie.title,
          provider: EMovieProvider.STARWARS,
        })),
      ];
    }

    return {
      page: 0,
      items,
      count: items.length,
    };
  }
}

export interface IListMovieQuery {
  count: number;
  skip: number;
  ignoreProviders: EMovieProvider[];
}
