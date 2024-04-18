import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";
import { Movie } from "src/domain/entities";
import { Repository } from "./repository";
import { EMovieProvider, Entity } from "src/application/enums";
import { FilterQuery, IMovieRepository, IProviderQuery, ProviderType } from "../interfaces";

export class MovieRepository extends Repository<Movie> implements IMovieRepository {
  constructor(@InjectModel(Entity.Movie) private readonly movieModel: Model<Movie>) {
    super(movieModel);
  }

  async getFilm(id: string): Promise<Movie> {
    return await this.movieModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async getFilms(filter?: IProviderQuery): Promise<Movie[]> {
    const query = this.movieModel.find({ provider: EMovieProvider.CUSTOM });

    if (Boolean(filter?.count)) query.limit(filter?.count);
    if (Boolean(filter?.skip)) query.skip(filter.skip);

    return await query.exec();
  }

  async getFilmsFromProvider(provider: EMovieProvider, filter?: IProviderQuery): Promise<ProviderType[]> {
    const query = this.movieModel.find({ provider: provider });

    if (Boolean(filter?.count)) query.limit(filter?.count);
    if (Boolean(filter?.skip)) query.skip(filter.skip);

    return await query.exec();
  }

  async getFilmFromProvider(provider: EMovieProvider, reference: string): Promise<ProviderType> {
    return await this.movieModel.findOne({ provider: provider, providerReference: reference });
  }

  getReference(id: string): string {
    return id;
  }

  // upsert in true for this one
  async update<T>(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return this.movieModel.findOneAndUpdate(filter.query, data, { new: true, upsert: true, strict: false }).exec() as T;
  }
}
