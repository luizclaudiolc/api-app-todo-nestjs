import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

export interface IRequestUser {
  id: string;
  email: string;
  name: string;
}

export interface IRequestWithUser extends Request {
  user: IRequestUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user) {
    const { id, name, email } = user;

    const payload = {
      sub: id,
      email,
    };

    return {
      token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      name,
    };
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    data.password = hashSync(data.password, +process.env.SALT_HASH);

    const { name, email } = await this.prisma.user.create({
      data,
    });

    return {
      name,
      email,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuário ou senha incorretos');
    }

    const validPassword = compareSync(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Usuário ou senha incorretos');
    }

    return user;
  }
}
