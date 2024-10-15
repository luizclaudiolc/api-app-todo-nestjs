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
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth-guard';
import { CurrentUserDto } from 'src/auth/strategies/current-user.tdo';
import { CurrentUser } from 'src/auth/strategies/current-user-decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/task/')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() { userId }: CurrentUserDto,
  ) {
    return await this.taskService.create(createTaskDto, userId);
  }

  @Get()
  async findAll(@CurrentUser() { userId }: CurrentUserDto) {
    return await this.taskService.findAllByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.taskService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }
}
