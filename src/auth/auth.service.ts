import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service.js';
import { AuthReturnDTO } from '../dto/auth.dto.js';
import { CreateUserReturnDTO } from '../dto/user.dto.js';
import { HashUtil } from '../utils/hash.util.js';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private mailService: MailService) { }
  async signIn(email: string, password: string): Promise<any> {
    const getUser = await this.usersService.getUser({ email });
    const user = getUser.data

    // Include bcrypt
    if (!user || !(await HashUtil.comparePassword(password, user.password!))) {
      return 'Invalid email or password';
    }
    const { password: _, createdAt, ...result } = user;
    console.log(result);
    const payload = { ...result, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    result['access_token'] = token;
    return {
      sucess: true,
      message: "Successfully Signed In",
      data: result,
    }
  }

  async signUp(name: string, email: string, password: string): Promise<CreateUserReturnDTO> {
    const existingUser = await this.usersService.getUser({ email });
    if (existingUser.data) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const hashedPassword = await HashUtil.hashPassword(password);

    const newUser = await this.usersService.createUser({ name, email, password: hashedPassword });

    if (!newUser.data) {
      return {
        success: false,
        message: "Error creating new user"
      }
    }

    // Send welcome email
    // await this.mailService.sendMail(
    //   newUser.data!.email,
    //   'Welcome to Our Service',
    //   `Hello ${newUser.data.email},\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards,\nThe Team`,
    // );


    return {
      success: true,
      message: 'User created successfully',
      data: newUser.data,
    };
  }
}