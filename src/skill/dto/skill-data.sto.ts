import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UserSkillDataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  percentage: number;
}
