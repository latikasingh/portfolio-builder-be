import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DTOErrorMessage } from 'shared/error.constant';

export class SignInUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: DTOErrorMessage.INVALID_EMAIL })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{4,}/,
    {
      message: DTOErrorMessage.INVALID_PASSWORD,
    },
  )
  password: string;
}
