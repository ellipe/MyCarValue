import {
  IsInt,
  IsNumber,
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsNumber()
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
