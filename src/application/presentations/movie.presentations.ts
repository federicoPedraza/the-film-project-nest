import { EMovieProvider } from "../enums";

export class PostMoviePresentation {
  id: string;
}

export class ListMoviesPresentation {
  page: number;
  count: number;
  items: ListedMovieItemPresentation[];
}

export class ListedMovieItemPresentation {
  title: string;
  provider: EMovieProvider;
}
