import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { MESSEGE_HELPERS, REGEX_HELPERS } from 'src/helpers/regex.helper';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(REGEX_HELPERS.password, {
    message: MESSEGE_HELPERS.default,
  })
  password: string;
}
