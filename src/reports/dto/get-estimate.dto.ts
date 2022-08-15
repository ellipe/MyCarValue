import {
  IsInt,
  IsNumber,
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class GetEstimateDto {
  @IsString()
  @IsOptional()
  make: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsInt()
  @Min(1930)
  @Max(new Date().getFullYear())
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  mileage: number;

  @IsLongitude()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsLatitude()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
}
