import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { UserServiceDataDto } from './service-data.dto';
import { Type } from 'class-transformer';

export class CreateUserServiceDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserServiceDataDto)
  @ArrayNotEmpty()
  services: UserServiceDataDto[];
}
