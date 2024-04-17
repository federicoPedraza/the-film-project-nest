import { IMovie } from "src/domain/entities";
import { IRepository } from "./repository.interface";
import { IProviderRepository } from "./providers";

export interface IMovieRepository extends IRepository<IMovie>, IProviderRepository<IMovie> {}
