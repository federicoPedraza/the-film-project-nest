import { UpdateQuery, FilterQuery as MongooseFilterQuery } from "mongoose";

export interface IRepository<T> {
  create: (data: ICreateDocument<T> | T) => Promise<T>;
  findAll: (filter?: FilterQuery<T>) => Promise<T[]>;
  findOne: (filters: FilterQuery<T>) => Promise<T>;
  update: (filter: FilterQuery<T>, data: UpdateQuery<T>) => Promise<any>;
  updateAll: (filter: FilterQuery<T>, data: UpdateQuery<T>) => Promise<any>;
  delete: (filter: FilterQuery<T>) => Promise<any>;
}

export class FilterQuery<T> {
  query: MongooseFilterQuery<T>;
  populate?: string | string[];
  skip?: number;
  limit?: number;
}

export interface ICreateDocument<T> {
  value: T;
}
