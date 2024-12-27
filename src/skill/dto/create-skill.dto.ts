import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserSkillDataDto } from './skill-data.sto';

export class CreateUserSkillDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillDataDto)
  skills: UserSkillDataDto[];
}
