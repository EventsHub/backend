import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
