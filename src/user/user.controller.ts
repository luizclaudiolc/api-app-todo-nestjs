import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v2/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    const { userId } = req.user;
    return await this.userService.findAll(userId);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @Get('/some/:isDone')
  async findSome(@Param('isDone') isDone: number) {
    return await this.userService.findSome(isDone);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
