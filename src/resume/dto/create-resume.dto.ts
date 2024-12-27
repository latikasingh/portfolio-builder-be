import {
  IsString,
  IsArray,
  IsOptional,
  IsMongoId,
  IsNotEmpty,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserResumeDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  points: string[];

  @IsString()
  @IsOptional()
  startYear?: string;

  @IsString()
  @IsOptional()
  endYear: string;
}
