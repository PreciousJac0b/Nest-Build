import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('Extracted Token:', token);
    if (!token) return false;
    try {
      console.log('Verifying token...');
      const jwtString = await this.configService.get<string>('JWT_SECRET');
      console.log('Using JWT Secret:', jwtString);
      const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
      console.log('Token payload:', payload);
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
  
  private extractTokenFromHeader(request: Request): string | undefined {
    // Alternate approach to bypass type checking issues
    // const authHeader = request.headers['authorization'] as string | undefined;
    // if (!authHeader) return undefined;

    // const [type, token] = authHeader.split(' ');
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}