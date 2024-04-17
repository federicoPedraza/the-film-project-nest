import { IStarwarsMovie } from "src/domain/entities";
import { IProviderRepository } from "./providers-repository.interface";

export interface IStarwarsRepository extends IProviderRepository<IStarwarsMovie> {}
