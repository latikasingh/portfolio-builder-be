import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProjectDto } from './create-project.dto';

export class UpdateUserProjectDto extends PartialType(CreateUserProjectDto) {}
