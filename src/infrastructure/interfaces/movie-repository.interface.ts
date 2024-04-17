import { IMovie } from "src/domain/entities";
import { IRepository } from "./repository.interface";

export interface IMovieRepository extends IRepository<IMovie> {}
