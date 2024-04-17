import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { EMovieProvider } from "../enums";

export class PostMovieDTO {
  @IsString()
  @IsNotEmpty()
  provider: EMovieProvider;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @IsNumber()
  @IsOptional()
  episodeId?: number;

  @IsString()
  @IsOptional()
  producer?: string;
}
