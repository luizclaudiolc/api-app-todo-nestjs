import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    data.password = hashSync(data.password, +process.env.SALT_HASH);

    return await this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        name: true,
        email: true,
        tasks: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findFirst({
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findSome(data: number) {
    const isDone = Boolean(data);
    console.log(isDone);

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
