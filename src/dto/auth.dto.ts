import { UserDTO } from "./user.dto.js";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthReturnDTO {
  success: boolean;
  message: string;
  data?: UserDTO;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class SignupDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123' })
  @IsString()
  @MinLength(8)
  password: string;
}