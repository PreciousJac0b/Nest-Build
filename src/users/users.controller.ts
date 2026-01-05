import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { FindOneParams, UpdateUserDTO, ReturnAllUsersDTO, ReturnUserDTO, CreateUserDTO } from '../dto/user.dto.js';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { User, Prisma } from '../generated/prisma/client.js';
import { RolesGuard } from '../auth/role.guard.js';
import { Role } from '../enums/role.enum.js';
import { Roles } from '../auth/role.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: CreateUserDTO): Promise<ReturnUserDTO> {
    return this.usersService.createUser(data);
  }

  @Get()
  findAll(): Promise<ReturnAllUsersDTO> {
    return this.usersService.getAllUsers({ take: 10 });
  }

  @Roles(Role.Admin) 
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param() params: FindOneParams): Promise<ReturnUserDTO> {
    const id = Number(params.id);
    return this.usersService.getUser({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.updateUser({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.deleteUser({ id: Number(id) });
  // }
}
