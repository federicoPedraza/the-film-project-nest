import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MovieSchema, StarwarsMovieSchema } from "src/domain/entities";
import { MovieControllerV1 } from "../controllers";
import { MovieRepository } from "../repositories";
import { Entity, PORT } from "src/application/enums";
import * as UseCase from "src/application/use-cases";

@Module({
  imports: [MongooseModule.forFeature([{ name: Entity.Movie, schema: MovieSchema, discriminators: [{ name: Entity.StarwarsMovie, schema: StarwarsMovieSchema }] }])],
  controllers: [MovieControllerV1],
  providers: [UseCase.PostMovieV1, { provide: PORT.Movie, useClass: MovieRepository }],
  exports: [],
})
export class MovieModule {}
