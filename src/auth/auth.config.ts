import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfig implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    };
  }
}
