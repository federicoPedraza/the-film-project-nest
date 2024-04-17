import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export interface IMovieMetadata {
  uploadedBy: Types.ObjectId;
}

@Schema({ versionKey: false, timestamps: false, _id: false })
export class MovieMetadata extends Document implements IMovieMetadata {
  @Prop({ type: Types.ObjectId, required: true })
  uploadedBy: Types.ObjectId;
}

export const MovieMetadataSchema = SchemaFactory.createForClass(MovieMetadata);
