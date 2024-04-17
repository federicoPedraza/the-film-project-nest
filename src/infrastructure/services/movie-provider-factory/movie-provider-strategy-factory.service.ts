import { Inject, Injectable } from "@nestjs/common";

import { EMovieProvider, PORT } from "src/application/enums";
import { IMovieRepository, IProviderRepository, IStarwarsRepository } from "src/infrastructure/interfaces";

@Injectable()
export class MovieProviderStrategyFactory {
  private strategyMap: Map<EMovieProvider, IProviderRepository<any>>;

  constructor(
    @Inject(PORT.Starwars) private readonly starwarsRepository: IStarwarsRepository,
    @Inject(PORT.Movie) private readonly moviesRepository: IMovieRepository,
  ) {
    this.strategyMap = new Map<EMovieProvider, IProviderRepository<any>>([
      [EMovieProvider.STARWARS, starwarsRepository],
      [EMovieProvider.CUSTOM, moviesRepository],
    ]);
  }

  getStrategy(provider: string): IProviderRepository<any> {
    const strategy = this.strategyMap.get(provider as EMovieProvider);

    return strategy;
  }
}
