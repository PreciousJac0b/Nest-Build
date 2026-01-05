import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { BookStatus } from "../generated/prisma/enums.js";

export class BookDTO {
  id: number;
  name: string;
  status?: BookStatus | null;
  cover: string | null;
  yearPublished: number;
  createdAt: Date;
}

export class ReturnBookDTO {
  success: boolean;
  message: string;
  data?: BookDTO;
}

export class ReturnBooksDTO {
  success: boolean;
  message: string;
  data?: BookDTO[];
}

export class CreateBookDTO {
  @IsString()
  @IsNotEmpty({ message: 'Book name is required' })
  name: string;

  @IsOptional()
  @IsEnum(BookStatus, { message: 'Invalid book status' })
  status?: BookStatus;

  @IsOptional()
  @IsString({ message: 'Cover must be a string' })
  cover?: string;

  @IsInt()
  @Min(1000, { message: 'Year published must be valid' })
  @Max(new Date().getFullYear(), {
    message: 'Year published cannot be in the future',
  })
  yearPublished: number;
}