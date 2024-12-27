import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SocialMediaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
