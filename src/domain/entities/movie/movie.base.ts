import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IMongoDBEntity } from "../entity.base";
import { EMovieProvider } from "src/application/enums";
import { IMovieMetadata, MovieMetadata, MovieMetadataSchema } from "./movie-metadata.entity";

export interface IMovie extends IMongoDBEntity {
  title: string;
  director: string;
  provider: EMovieProvider;
  metadata: IMovieMetadata;
  providerReference?: string;
}

@Schema({ versionKey: false, timestamps: true })
export class Movie extends Document implements IMovie {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  director: string;

  @Prop({ type: String, enum: EMovieProvider, required: true })
  provider: EMovieProvider;

  @Prop({ type: String })
  providerReference: string;

  @Prop({ type: MovieMetadataSchema, required: true })
  metadata: MovieMetadata;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
