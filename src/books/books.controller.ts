import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDTO, ReturnBookDTO, ReturnBooksDTO } from '../dto/book.dto.js';
import { FindOneParams, ReturnUserDTO } from '../dto/user.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService, private readonly cloudinaryService: CloudinaryService) { }

  @Get()
  async findAll(): Promise<ReturnBooksDTO> {
    return this.booksService.getAllBooks({ take: 10 });
  }

  @Get(':id')
  findOne(@Param() params: FindOneParams): Promise<ReturnBookDTO> {
    const id = Number(params.id);
    return this.booksService.getOneBook({ id });
  }

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  async createBook(@UploadedFile() file: Express.Multer.File, @Body() data: CreateBookDTO): Promise<ReturnBookDTO> {
    let coverUrl: string | undefined;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);

      coverUrl = uploadResult.secure_url;
    }
    return this.booksService.createBook({cover: coverUrl ?? 'default-cover.jpg', ...data});
  }
}
