import { Expose, Transform, Type } from 'class-transformer';
import { UserDto } from '../../users/dtos/user.dto';

export class ReportDto {
  @Expose()
  id: string;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  // Use this for exposing the User with custom exposed fields
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  // Use this for exposing the userId with a transformation
  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: string;
}
