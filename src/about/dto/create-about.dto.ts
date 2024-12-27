import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Degree } from 'shared/enum/degree.enum';
import { Transform } from 'class-transformer';

export class CreateUserAboutDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  designationDescription: string;

  @IsString()
  @IsNotEmpty()
  DOB: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsUrl()
  @IsNotEmpty()
  website: string;

  @IsEnum(Degree)
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  degree: Degree;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsBoolean()
  @IsOptional()
  freelancer?: boolean;

  @IsNumber()
  @IsOptional()
  happilyClient?: number;

  @IsNumber()
  @IsOptional()
  projects?: number;
  @IsNumber()
  @IsOptional()
  houseOfSupports?: number;

  @IsNumber()
  @IsOptional()
  team?: number;
}
