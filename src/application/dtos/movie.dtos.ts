import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PostMovieDTO {
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
