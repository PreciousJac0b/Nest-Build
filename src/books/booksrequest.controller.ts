import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { BooksRequestsService } from "./booksrequests.service.js";
import { AuthGuard } from "../auth/auth.guard.js";


@Controller('books-requests')
export class BooksRequestController {
  constructor(private booksRequestsService: BooksRequestsService) { }

  @Post()
  @UseGuards(AuthGuard)
  createBookRequest(@Req() req,
    @Body('bookId') bookId: number,) {
    const userId = req.user.sub;
    return this.booksRequestsService.createBookRequest(userId, bookId);
  }
}