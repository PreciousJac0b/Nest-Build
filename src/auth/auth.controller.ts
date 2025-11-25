import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthReturnDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: { email: string; password: string }): Promise<string> {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  async signUp(@Body() body: { name: string, email: string; password: string }): Promise<AuthReturnDTO> {
    const { name, email, password } = body;
    return this.authService.signUp(name, email, password);
  }
}
