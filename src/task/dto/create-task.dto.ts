import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Task } from '../entities/task.entity';

export class CreateTaskDto extends Task {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  isDone?: boolean = false;
}
