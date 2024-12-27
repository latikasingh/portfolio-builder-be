import { CreateUserAboutDto } from './create-about.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserAboutDto extends PartialType(CreateUserAboutDto) {}
