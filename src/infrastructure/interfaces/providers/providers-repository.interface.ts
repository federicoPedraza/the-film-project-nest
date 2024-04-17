export interface IProviderQuery {
  count: number;
  skip: number;
}

export interface IProviderRepository<T> {
  getFilms: (query?: IProviderQuery) => Promise<T[]>;
  getFilm: (id: string) => Promise<T>;
}
