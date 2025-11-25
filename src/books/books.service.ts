import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  async findAll(): Promise<string[]> {
    return ['Book 1', 'Book 2', 'Book 3'];
  }
}
