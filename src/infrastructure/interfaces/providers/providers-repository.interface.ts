import { IMovie, IStarwarsMovie } from "src/domain/entities";

export interface IProviderQuery {
  count: number;
  skip: number;
  propagateErrors?: boolean;
}

export interface IProviderRepository<T> {
  getFilms: (query?: IProviderQuery) => Promise<T[]>;
  getFilm: (id: string) => Promise<T>;
  getReference: (id: string) => string;
}

export type ProviderType = IStarwarsMovie | IMovie; // | AnotherTypeOfMovie | Another
