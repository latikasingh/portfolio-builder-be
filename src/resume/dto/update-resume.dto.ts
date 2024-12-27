import { PartialType } from '@nestjs/mapped-types';
import { CreateUserResumeDto } from './create-resume.dto';

export class UpdateUserResumeDto extends PartialType(CreateUserResumeDto) {}
