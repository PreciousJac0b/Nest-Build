import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReturnBookDTO, ReturnBooksDTO, CreateBookDTO } from 'src/dto/book.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  async getAllBooks(params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.BookWhereUniqueInput;
      where?: Prisma.BookWhereInput;
      orderBy?: Prisma.BookOrderByWithRelationInput;}): Promise<ReturnBooksDTO> {
    const { skip, take, cursor, where, orderBy } = params;
    const books = await this.prisma.book.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    if (!books || books.length === 0) {
      return {
        success: false,
        message: 'No books found',
      };
    }

    return {
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    };
  }

  async getOneBook(
    bookWhereUniqueInput: Prisma.BookWhereUniqueInput,
  ): Promise<ReturnBookDTO> {
    const book = await this.prisma.book.findUnique({
      where: bookWhereUniqueInput
    });
    if (!book) {
      return {
        success: false,
        message: 'Book not found',
      };
    }
    return {
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    };
  }

  async createBook(data: CreateBookDTO): Promise<ReturnBookDTO> {
    const book =  await this.prisma.book.create({
      data,
    });
    if (!book) {
      return {
        success: false,
        message: 'Book creation failed',
      };
    }
    return {
      success: true,
      message: 'Book created successfully',
      data: book,
    };
  }


}
