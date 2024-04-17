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

  // --- STAR WARS FIELDS
  @IsNumber()
  @IsOptional()
  providerId: number;

  @IsOptional()
  opening_crawl: string;

  @IsOptional()
  @IsArray()
  species?: string[];

  @IsArray()
  @IsOptional()
  planets?: string[];

  @IsArray()
  @IsOptional()
  characters?: string[];

  @IsArray()
  @IsOptional()
  starships?: string[];

  @IsArray()
  @IsOptional()
  vehicles?: string[];
}
