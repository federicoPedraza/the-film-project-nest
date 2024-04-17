import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie } from "src/domain/entities";
import { Repository } from "./repository";
import { Entity } from "src/application/enums";
import { FilterQuery } from "../interfaces";

export class MovieRepository extends Repository<Movie> {
  constructor(@InjectModel(Entity.Movie) private readonly movieModel: Model<Movie>) {
    super(movieModel);
  }

  async findAll(filter?: FilterQuery<Movie>): Promise<Movie[]> {
    const query = this.movieModel.find(filter?.query);

    if (Boolean(filter?.populate)) query.populate(filter?.populate);
    if (Boolean(filter?.limit)) query.limit(filter?.limit);
    if (Boolean(filter?.skip)) query.skip(filter.skip);

    return await query.exec();
  }
}
