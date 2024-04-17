import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IMongoDBEntity } from "../entity.base";
import { EMovieProvider } from "src/application/enums";

export interface IMovie extends IMongoDBEntity {
  title: string;
  director: string;
  url: string;
  provider: EMovieProvider;
}

@Schema({ versionKey: false, timestamps: true })
export class Movie extends Document implements IMovie {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  director: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, enum: EMovieProvider, required: true })
  provider: EMovieProvider;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
