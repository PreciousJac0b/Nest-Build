import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsMongoId } from 'class-validator';


export class ReturnAllUsersDTO {
  success: boolean;
  message: string;
  data?: object[];
}

export class ReturnUserDTO {
  success: boolean;
  message: string;
  data?: object;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;
}

export class FindOneParams {
  @IsMongoId({ message: 'ID must be a valid MongoDB ObjectId' })
  id: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
