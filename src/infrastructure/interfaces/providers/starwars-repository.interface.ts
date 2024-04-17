import { IStarwarsMovie } from "src/domain/entities";

export interface IStarwarsRepository {
  getFilms: () => Promise<IStarwarsMovie[]>;
  getFilm: (id: string) => Promise<IStarwarsMovie>;
}
