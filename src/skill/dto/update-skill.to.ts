import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSkillDto } from './create-skill.dto';

export class UpdateUserSkillDto extends PartialType(CreateUserSkillDto) {}
