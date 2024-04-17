import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Movie } from "src/domain/entities";
import { Repository } from "./repository";
import { Entity } from "src/application/enums";
import { IMovieRepository, IProviderQuery } from "../interfaces";

export class MovieRepository extends Repository<Movie> implements IMovieRepository {
  constructor(@InjectModel(Entity.Movie) private readonly movieModel: Model<Movie>) {
    super(movieModel);
  }

  async getFilm(id: string): Promise<Movie> {
    return await this.movieModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async getFilms(filter?: IProviderQuery): Promise<Movie[]> {
    const query = this.movieModel.find();

    if (Boolean(filter?.count)) query.limit(filter?.count);
    if (Boolean(filter?.skip)) query.skip(filter.skip);

    return await query.exec();
  }
}
