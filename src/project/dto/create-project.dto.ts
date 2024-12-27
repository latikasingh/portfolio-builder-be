import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateIf,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserProjectDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description_title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl({}, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  projectImages?: string[];

  @ValidateIf((o) => o.link !== '')
  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;
}
