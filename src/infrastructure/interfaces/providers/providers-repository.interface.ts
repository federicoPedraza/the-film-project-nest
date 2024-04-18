export interface IProviderQuery {
  count: number;
  skip: number;
  propagateErrors?: boolean;
}

export interface IProviderRepository<T> {
  getFilms: (query?: IProviderQuery) => Promise<T[]>;
  getFilm: (id: string) => Promise<T>;
}
