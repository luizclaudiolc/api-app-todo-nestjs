import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  private refreshTokenVersions: Map<string, string> = new Map();

  async login(data: { email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser)
      throw new UnauthorizedException('Credenciais inválidas!');

    const validPassword = compareSync(data.password, existingUser.password);

    if (!validPassword)
      throw new UnauthorizedException('Usuário ou senha incorretos');

    const userId = existingUser.id;
    const tokenId = uuidv4();
    this.refreshTokenVersions.set(userId, tokenId);

    const payload = {
      username: existingUser.email,
      sub: existingUser.id,
      tokenId,
    };

    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: '120s' },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '1h' },
    );

    return { accessToken, refreshToken };
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    data.password = hashSync(data.password, +process.env.SALT_HASH);

    const { email, name } = await this.prisma.user.create({
      data,
    });

    return { name, email };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const userTokenId = this.refreshTokenVersions.get(payload.sub);
      if (!userTokenId || userTokenId !== payload.tokenId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newTokenId = uuidv4();
      this.refreshTokenVersions.set(payload.sub, newTokenId);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        username: user.email,
        sub: user.id,
        tokenId: newTokenId,
      };

      const newAccessToken = this.jwtService.sign(
        { ...newPayload, type: 'access' },
        { expiresIn: '120s' },
      );

      const newRefreshToken = this.jwtService.sign(
        { ...newPayload, type: 'refresh' },
        { expiresIn: '1h' },
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
