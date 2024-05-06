import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class UserByIdsDto {
  @IsNotEmpty()
  @IsArray()
  ids: number[];
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
