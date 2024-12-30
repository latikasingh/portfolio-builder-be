import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UserSkillDataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number(value))
  percentage: number;
}
