import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
      name: user.name,
    };
  }

  async create(data: CreateUserDto) {
    data.password = hashSync(data.password, +process.env.SALT_HASH);

    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    let user;
    try {
      user = await this.userService.findOneByEmail(email);
    } catch (error) {
      return null;
    }

    const validPassword = compareSync(password, user.password);
    if (!validPassword) return null;
    return user;
  }
}
