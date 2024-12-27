import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { SocialMediaDto } from './social-media.dto';
import { DTOErrorMessage } from 'shared/error.constant';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsArray()
  @ArrayNotEmpty()
  tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaDto)
  @ArrayNotEmpty({ message: DTOErrorMessage.AT_LEAST_ONE_SOCIAL_MEDIA })
  @IsOptional()
  socialMedia?: SocialMediaDto[];

  @IsOptional()
  @IsString()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  profileImage?: string;
}
