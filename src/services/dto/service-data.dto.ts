import { IsNotEmpty, IsString, Min } from 'class-validator';

export class UserServiceDataDto {
  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
