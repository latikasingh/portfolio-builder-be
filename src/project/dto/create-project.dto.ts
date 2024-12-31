import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateIf,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { ProjectType } from 'shared/enum/project-type.enum';

export class CreateUserProjectDto {
  @IsEnum(ProjectType, {
    message: 'Type must be one of: App, Product, Book, Branding',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  descriptionTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  projectImages?: string[];

  @ValidateIf((o) => o.link !== '')
  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;
}
