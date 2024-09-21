import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(id: string) {
    return await this.prisma.user.findMany({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        tasks: true,
      },
    });
  }

  async findOneById(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
        select: {
          name: true,
          email: true,
          tasks: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Erro ao buscar o usuário:', error);
      throw new Error('Erro interno ao buscar o usuário.');
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Erro ao buscar o usuário:', error);
      throw new Error('Erro interno ao buscar o usuário.');
    }
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findSome(data: number) {
    const isDone = Boolean(data);
    const usersWithTasks = await this.prisma.user.findMany({
      where: {
        tasks: {
          some: {
            isDone,
          },
        },
      },
      select: {
        name: true,
        email: true,
        tasks: true,
      },
    });

    usersWithTasks.map((user) => {
      user.tasks = user.tasks.filter((task) => task.isDone === isDone);
      return user;
    });

    return usersWithTasks;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
