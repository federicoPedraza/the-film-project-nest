import { IMovie } from "src/domain/entities";
import { IRepository } from "./repository.interface";
import { IProviderQuery, IProviderRepository, ProviderType } from "./providers";
import { EMovieProvider } from "src/application/enums";

export interface IMovieRepository extends IRepository<IMovie>, IProviderRepository<IMovie> {
  getFilmsFromProvider: (provider: EMovieProvider, filter?: IProviderQuery) => Promise<ProviderType[]>;
  getFilmFromProvider: (provider: EMovieProvider, reference: string) => Promise<ProviderType>;
}
