import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../enums/role.enum.js';


export class ReturnAllUsersDTO {
  success: boolean;
  message: string;
  data?: object[];
}

export class ReturnUserDTO {
  success: boolean;
  message: string;
  data?: UserDTO;
}

export class UserDTO {
  id: number;
  name: string | null;
  email: string;
  role: string;
  password?: string;
  createdAt: Date;
}

export class CreateUserReturnDTO {
  success: boolean;
  message: string;
  data?: UserDTO;
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class FindOneParams {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
