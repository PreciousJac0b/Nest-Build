import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) return false;
    try {
      const jwtString = await this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
      request['user'] = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
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