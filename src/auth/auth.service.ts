import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async register(
    body: RegisterDto,
  ): Promise<{ message: string; email: string }> {
    const { email, password } = body;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        await this.i18n.translate('auth.email_already_exists'),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return {
      message: await this.i18n.translate('auth.register_success'),
      email: newUser.email,
    };
  }

  async login(
    body: LoginDto,
  ): Promise<{ access_token: string; credits: number; message: string }> {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('auth.user_not_found'),
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        await this.i18n.translate('auth.wrong_password'),
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      message: await this.i18n.translate('auth.login_success'),
      credits: user.credits,
      access_token: token,
    };
  }
}
