import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class SocialMediaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((o) => o.link !== '')
  @IsUrl()
  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
