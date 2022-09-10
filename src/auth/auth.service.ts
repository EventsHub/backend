import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './role.enum';
import { TokenDto } from './dto/token.dto';
import { MessageResponseDto } from './dto/message-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
  ) {}

  public async register(registerDto: RegisterDto): Promise<MessageResponseDto> {
    const { username, email, password }: RegisterDto = registerDto;
    let user: User = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException(
        'Пользователь с таким логином уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (this.helper.comparePassword(registerDto.password, registerDto.passwordConfirm)) {
      user = new User();

      user.username = username;
      user.email = email;
      user.password = this.helper.encodePassword(password);
      user.role = Role.user;
      return this.userRepository
        .save(user)
        .then(() => {
          return new MessageResponseDto('Пользователь зарегистрирован', HttpStatus.CREATED);
        })
        .catch(() => {
          return new MessageResponseDto('Ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }
    throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST);
  }

  public async login(loginDto: LoginDto): Promise<TokenDto | never> {
    const { username, password }: LoginDto = loginDto;
    const user: User = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('Неверное имя пользователя или пароль', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Неверное имя пользователя или пароль', HttpStatus.BAD_REQUEST);
    }

    return new TokenDto(this.helper.generateToken(user));
  }

  // public async refresh(user: User): Promise<string> {
  //   return this.helper.generateToken(user);
  // }
}
