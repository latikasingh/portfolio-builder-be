import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUrl,
  ValidateIf,
} from 'class-validator';

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
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  age: number;

  @ValidateIf((o) => o.link !== '')
  @IsUrl()
  @IsOptional()
  website: string;

  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsBoolean()
  @IsOptional()
  freelancer?: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  happyClient?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  projects?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  hoursOfSupports?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  team?: number;
}
