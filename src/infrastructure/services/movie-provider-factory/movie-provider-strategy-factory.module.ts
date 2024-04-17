import { Module } from "@nestjs/common";

import { Entity, PORT } from "src/application/enums";
import { MovieRepository, StarwarsRepository } from "src/infrastructure/repositories";
import { MovieProviderStrategyFactory } from "./movie-provider-strategy-factory.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieSchema } from "src/domain/entities";

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: Entity.Movie, schema: MovieSchema }])],
  providers: [
    MovieProviderStrategyFactory,
    {
      provide: PORT.Starwars,
      useClass: StarwarsRepository,
    },
    {
      provide: PORT.Movie,
      useClass: MovieRepository,
    },
  ],
  exports: [MovieProviderStrategyFactory],
})
export class MovieProviderFactoryModule {}
