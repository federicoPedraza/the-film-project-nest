import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMovie, Movie } from "./movie.base";

export interface IStarwarsMovie extends IMovie {
  providerId: number;
  openingCrawl: string;
  species?: string[];
  planets?: string[];
  characters?: string[];
  starships?: string[];
  vehicles?: string[];
}

@Schema()
export class StarwarsMovie extends Movie implements IStarwarsMovie {
  @Prop({ type: Number, required: true })
  providerId: number;

  @Prop({ type: String, required: true })
  openingCrawl: string;

  @Prop({ type: [String] })
  species: string[];

  @Prop({ type: [String] })
  planets: string[];

  @Prop({ type: [String] })
  characters: string[];

  @Prop({ type: [String] })
  starships: string[];

  @Prop({ type: [String] })
  vehicles: string[];
}

export const StarwarsMovieSchema = SchemaFactory.createForClass(StarwarsMovie);
