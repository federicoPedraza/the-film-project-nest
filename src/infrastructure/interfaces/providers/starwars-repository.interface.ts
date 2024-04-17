import { IStarwarsMovie } from "src/domain/entities";

export interface IStarwarsRepository {
  getFilms: () => Promise<IStarwarsMovie[]>;
}
