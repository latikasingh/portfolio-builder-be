import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserSkillDataDto } from './skill-data.sto';

export class CreateUserSkillDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillDataDto)
  @ArrayNotEmpty()
  skills: UserSkillDataDto[];
}
