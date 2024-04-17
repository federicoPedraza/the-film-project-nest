import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie } from "src/domain/entities";
import { Repository } from "./repository";
import { Entity } from "src/application/enums";

export class MovieRepository extends Repository<Movie> {
  constructor(@InjectModel(Entity.Movie) private readonly movieModel: Model<Movie>) {
    super(movieModel);
  }
}
