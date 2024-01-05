import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    return await this.prisma.task.create({
      data,
    });
  }

  async findAllByUserId(userId: string) {
    return await this.prisma.task.findMany({
      where: {
        userId,
      },
      select: {
        title: true,
        description: true,
        isDone: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id,
        },
        select: {
          user: {
            select: {
              name: true,
            },
          },
          title: true,
          description: true,
          isDone: true,
        },
      });

      if (!task) {
        throw new NotFoundException('Tarefa não encontrada!');
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Erro ao buscar a tarefa:', error);
      throw new Error('Erro interno ao buscar a tarefa.');
    }
  }

  async update(id: string, data: UpdateTaskDto) {
    return await this.prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
