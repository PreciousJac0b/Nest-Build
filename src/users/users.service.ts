import { Injectable } from '@nestjs/common';
import { ReturnAllUsersDTO, ReturnUserDTO, CreateUserReturnDTO, CreateUserDTO, UpdateUserDTO } from '../dto/user.dto.js';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './entities/user.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { User, Prisma } from '../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<ReturnUserDTO> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async getAllUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<ReturnAllUsersDTO> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    if (!users || users.length === 0) {
      return {
        success: false,
        message: 'No users found',
      };
    }
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    }
  }

  async createUser(data: CreateUserDTO): Promise<CreateUserReturnDTO> {
    const createdUser = await this.prisma.user.create({data,});
    if (!createdUser) {
      return {
        success: false,
        message: "Failed to create user."
      }
    }
    return {
      success: true,
      message: "Successfully created user.",
      data: createdUser
    } 
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDTO;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }


  // async create(createUserDto: CreateUserDto) {
  //   // const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec(); 
  //   const existingUser = await this.prisma.user.findUnique({
  //     where: { email: createUserDto.email },
  //   });
  //   if (existingUser) {
  //     return {
  //       success: false,
  //       message: 'User with this email already exists',
  //     };
  //   }
  //   const savedUser = await this.prisma.user.create({
  //     data: {
  //       name: createUserDto.name,
  //       email: createUserDto.email,
  //       password: createUserDto.password,
  //     },
  //   });
  //   // const user = new this.userModel(createUserDto);
  //   // const savedUser = await user.save();

  //   if (!savedUser) {
  //     return {
  //       success: false,
  //       message: 'Failed to create user',
  //     };
  //   }

  //   return {
  //     success: true,
  //     message: 'User created successfully',
  //     data: savedUser,
  //   };
  // }

  // async findAll(): Promise<ReturnAllUsersDTO> {
  //   const users = await this.userModel.find().exec();
  //   if (!users || users.length === 0) {
  //     return {
  //       success: false,
  //       message: 'No users found',
  //     }
  //   }
  //   return {
  //     success: true,
  //     message: 'Users retrieved successfully',
  //     data: users,
  //   };
  // }

  // async findOne(id: string): Promise<ReturnUserDTO> {
  //   if (!id) {
  //     return Promise.resolve({
  //       success: false,
  //       message: 'User ID is required',
  //     });
  //   }
  //   const user = await this.userModel.findById(id).exec();
  //   console.log('Found user:', user);
  //   if (!user) {
  //     return Promise.resolve({
  //       success: false,
  //       message: 'User not found',
  //     });
  //   }

  //   return Promise.resolve({
  //     success: true,
  //     message: 'User retrieved successfully',
  //     data: user,
  //   });
  // }

  // async findByEmail(email: string): Promise<User | null> {
  //   return this.userModel.findOne({ email }).exec();
  // }
}
