import { IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { ProviderType } from "src/infrastructure/interfaces";

export class PostMovieDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

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

export class EditMovieDTO {
  @IsObject()
  @IsOptional()
  providerFields?: Partial<ProviderType>;
}
