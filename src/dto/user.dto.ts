import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  firstName: string | null;
  lastName: string | null;
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
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  firstName: string;

  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  lastName: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @ApiProperty({ description: 'Password for the user account', example: 'strongPassword123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class UpdateUserDTO {
  @ApiProperty({ description: 'Name of the user', example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Name of the user', example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Role of the user', example: 'User', required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class FindOneParams {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
