import { Injectable } from '@nestjs/common';
import { ReturnAllUsersDTO, ReturnUserDTO, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec(); 
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    if (!savedUser) {
      return {
        success: false,
        message: 'Failed to create user',
      };
    }
    
    return {
      success: true,
      message: 'User created successfully',
      data: savedUser,
    };
  }

  async findAll(): Promise<ReturnAllUsersDTO> {
    const users = await this.userModel.find().exec();
    if (!users || users.length === 0) {
      return {
        success: false,
        message: 'No users found',
      }
    }
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
    }

  async findOne(id: string): Promise<ReturnUserDTO> {
    if (!id) {
      return Promise.resolve({
        success: false,
        message: 'User ID is required',
      });
    }
    const user = await this.userModel.findById(id).exec();
    console.log('Found user:', user);
    if (!user) {
      return Promise.resolve({
        success: false,
        message: 'User not found',
      });
    }

    return Promise.resolve({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
