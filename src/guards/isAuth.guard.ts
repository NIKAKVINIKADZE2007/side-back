import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request.headers);

    if (!token) {
      throw new UnauthorizedException('Token is missing'); // 401
    }

    try {
      const payload = await this.jwtService.verify(token);
      request.userId = payload.id;
      request.role = payload.role;

      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token'); // 401
    }
  }

  private getToken(headers: Record<string, string>): string | null {
    const authHeader = headers['authorization'];
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
