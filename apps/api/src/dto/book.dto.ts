import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { BookStatus } from "../generated/prisma/enums.js";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

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
  @ApiProperty({ description: 'Name of the book', example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty({ message: 'Book name is required' })
  name: string;

  @ApiProperty({ description: 'Status of the book', example: 'AVAILABLE', required: false })
  @IsOptional()
  @IsEnum(BookStatus, { message: 'Invalid book status' })
  status?: BookStatus;

  @ApiProperty({ description: 'Cover image URL of the book', example: 'http://example.com/cover.jpg', required: false })
  @IsOptional()
  @IsString({ message: 'Cover must be a string' })
  cover?: string;

  @ApiProperty({ description: 'Year the book was published', example: 1925 })
  @Type(() => Number)
  @IsInt({ message: 'yearPublished must be an integer number' })
  @Min(1000, { message: 'Year published must be valid' })
  @Max(new Date().getFullYear(), {
    message: 'Year published cannot be in the future',
  })
  yearPublished: number;
}
