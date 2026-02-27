import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { FindOneParams, UpdateUserDTO, ReturnAllUsersDTO, ReturnUserDTO, CreateUserDTO } from '../dto/user.dto.js';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { User, Prisma } from '../generated/prisma/client.js';
import { RolesGuard } from '../auth/role.guard.js';
import { Role } from '../enums/role.enum.js';
import { Roles } from '../auth/role.decorator.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  create(@Body() data: CreateUserDTO): Promise<ReturnUserDTO> {
    return this.usersService.createUser(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of users' })
  @ApiResponse({ status: 200, description: 'A list of users has been successfully retrieved.', isArray: true })
  findAll(): Promise<ReturnAllUsersDTO> {
    return this.usersService.getAllUsers({ take: 10 });
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.' })
  findOne(@Param() params: FindOneParams): Promise<ReturnUserDTO> {
    const id = Number(params.id);
    return this.usersService.getUser({ id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
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
