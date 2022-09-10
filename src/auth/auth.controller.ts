import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { MessageResponseDto } from './dto/message-response.dto';

@Controller('api/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<MessageResponseDto | never> {
    return this.authService.register(body);
  }

  @Post('login')
  private login(@Body() body: LoginDto): Promise<TokenDto | never> {
    return this.authService.login(body);
  }
}
