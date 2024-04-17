export class DefaultApiResponse<T> {
  message?: string;
  info?: T;
  status: number;
}
