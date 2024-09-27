import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { IRequestUser } from 'src/auth/auth.service';

@Controller('api/v2/task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() { userId }: IRequestUser,
  ) {
    return await this.taskService.create(createTaskDto, userId);
  }

  @Get()
  async findAll(@Request() { userId }: IRequestUser) {
    return await this.taskService.findAllByUserId(userId);
  }

  @Get('/:publicId')
  async findOne(@Param('publicId') publicId: string) {
    return await this.taskService.findOne(publicId);
  }

  @Patch('/:publicId')
  async update(
    @Param('publicId') publicId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.taskService.update(publicId, updateTaskDto);
  }

  @Delete(':publicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('publicId') publicId: string) {
    return await this.taskService.remove(publicId);
  }
}
