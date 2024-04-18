import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieSchema, StarwarsMovieSchema, UserSchema } from "src/domain/entities";
import { MovieControllerV1 } from "../controllers";
import { MovieRepository, RedisRepository, StarwarsRepository, UserRepository } from "../repositories";
import { Entity, PORT } from "src/application/enums";
import * as UseCase from "src/application/use-cases";
import { MovieProviderFactoryModule, MovieProviderStrategyFactory } from "../services";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Movie, schema: MovieSchema, discriminators: [{ name: Entity.StarwarsMovie, schema: StarwarsMovieSchema }] },
      { name: Entity.User, schema: UserSchema },
    ]),
    MovieProviderFactoryModule,
    HttpModule,
  ],
  controllers: [MovieControllerV1],
  providers: [
    UseCase.PostMovieV1,
    UseCase.ListMoviesV1,
    UseCase.GetMovieDetailsV1,
    UseCase.EditMovieV1,
    { provide: PORT.Movie, useClass: MovieRepository },
    { provide: PORT.Starwars, useClass: StarwarsRepository },
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Redis, useClass: RedisRepository },
    { provide: PORT.MovieProviderStrategyFactory, useClass: MovieProviderStrategyFactory },
  ],
  exports: [],
})
export class MovieModule {}
