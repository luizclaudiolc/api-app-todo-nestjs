import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    console.log(createTaskDto);

    return await this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll() {
    return await this.prisma.task.findMany({
      select: {
        title: true,
        description: true,
        isDone: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.task.findFirst({
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
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.prisma.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
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
