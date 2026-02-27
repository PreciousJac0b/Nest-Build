import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthReturnDTO, LoginDto, SignupDto } from '../dto/auth.dto.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login endpoint' })
  @ApiResponse({ status: 200, description: 'Successfully Signed In' })
  @Post('login')
  async signIn(@Body() body: LoginDto): Promise<string> {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }

  @ApiOperation({ summary: 'User signup endpoint' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @Post('signup')
  async signUp(@Body() body: SignupDto): Promise<AuthReturnDTO> {
    const { firstName, lastName, email, password } = body;
    return this.authService.signUp(firstName, lastName, email, password);
  }
}
