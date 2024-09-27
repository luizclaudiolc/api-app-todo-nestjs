import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  // Buscar todas as tarefas de um usuário usando userId
  async findAllByUserId(userId: string) {
    return await this.prisma.task.findMany({
      where: { userId },
      select: {
        publicId: true, // Exibe o publicId em vez do id
        title: true,
        description: true,
        isDone: true,
      },
    });
  }

  // Buscar uma tarefa por publicId
  async findOne(publicId: string) {
    const task = await this.prisma.task.findUnique({
      where: { publicId }, // Busca pela coluna publicId
      select: {
        user: {
          select: {
            name: true,
          },
        },
        publicId: true, // Retorna o publicId
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

  // Atualizar uma tarefa pelo publicId
  async update(publicId: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { publicId }, // Usa o publicId para encontrar a tarefa
      data,
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada para atualização!');
    }

    return task;
  }

  // Remover uma tarefa pelo publicId
  async remove(publicId: string) {
    const task = await this.prisma.task.delete({
      where: { publicId }, // Usa o publicId para remover a tarefa
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada para remoção!');
    }

    return task;
  }
}
