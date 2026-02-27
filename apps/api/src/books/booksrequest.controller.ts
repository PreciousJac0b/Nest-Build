import { Body, Controller, Get, Post, Req, UseGuards, ParseIntPipe } from "@nestjs/common";
import { BooksRequestsService } from "./booksrequests.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { RolesGuard } from "../auth/role.guard.js";
import { Roles } from "../auth/role.decorator.js";
import { Role } from "../enums/role.enum.js";


@Controller('books-requests')
export class BooksRequestController {
  constructor(private booksRequestsService: BooksRequestsService) { }

  @Post()
  @UseGuards(AuthGuard)
  createBookRequest(@Req() req,
    @Body('bookId', ParseIntPipe) bookId: number,) {
    console.log('[createBookRequest] bookId:', bookId, typeof bookId);
    const userId = req.user.sub;
    return this.booksRequestsService.createBookRequest(userId, bookId);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllBookRequests(@Req() req) {
    return this.booksRequestsService.getAllBookRequests();
  }

  @Post('approve')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  approveBookRequest(@Req() req,
    @Body('requestId', ParseIntPipe) requestId: number) {
    const adminId = req.user.sub;
    return this.booksRequestsService.approveBookRequest(requestId, adminId);
  }

  @Post('reject')
  @UseGuards(AuthGuard)
  rejectBookRequest(@Req() req,
    @Body('requestId', ParseIntPipe) requestId: number) {
    const adminId = req.user.sub;
    return this.booksRequestsService.rejectBookRequest(requestId, adminId);
  }

  // @Post('refresh')
  // @UseGuards(AuthGuard)
  // refreshBookRequestPage(@Req() req) {
  //   return this.booksRequestsService.refreshBookRequestPage();
  // }

  // @Post('close')
  // @UseGuards(AuthGuard)
  // closeBookRequestPage(@Req() req) {
  //   return this.booksRequestsService.closeBookRequestPage();
  // }
}