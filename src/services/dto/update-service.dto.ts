import { PartialType } from '@nestjs/mapped-types';
import { CreateUserServiceDto } from './create-service.dto';

export class UpdateUserServiceDto extends PartialType(CreateUserServiceDto) {}
