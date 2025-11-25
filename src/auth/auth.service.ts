import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { AuthReturnDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private mailService: MailService) {}
  async signIn(email: string, password: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.password !== password) {
      return 'Invalid email or password';
    }
    const { password: _, ...result } = user.toObject();
    const payload = { email: user.email, sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    result['access_token'] = token;
    return result;
  }

  async signUp(name: string, email: string, password: string): Promise<AuthReturnDTO> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const newUser = await this.usersService.create({ name, email, password });

    // Send welcome email
    await this.mailService.sendMail(
      newUser.data!.email,
      'Welcome to Our Service',
      `Hello ${newUser.data!.email},\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards,\nThe Team`,
    );


    return {
      success: true,
      message: 'User created successfully',
      data: [newUser],
    };
  }
}