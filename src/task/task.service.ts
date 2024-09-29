import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type userType = {
  email: string;
  userId: string;
};
export interface IRequestUser {
  user: userType;
}

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar uma nova tarefa associada a um usuário
  async create(data: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });

    return task;
  }

  async findAllByUserId(userId: string) {
    return await this.prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        isDone: true,
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        id: true,
        title: true,
        description: true,
        isDone: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    return task;
  }

  async update(id: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data,
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada para atualização!');
    }

    return task;
  }

  // Remover uma tarefa pelo id
  async remove(id: string) {
    const task = await this.prisma.task.delete({
      where: { id }, // Usa o id para remover a tarefa
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada para remoção!');
    }

    return task;
  }
}
