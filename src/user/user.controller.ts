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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth-guard';
import { CurrentUserDto } from 'src/auth/strategies/current-user.tdo';
import { CurrentUser } from 'src/auth/strategies/current-user-decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/v2/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@CurrentUser() { userId }: CurrentUserDto) {
    return await this.userService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @Get('/some:isDone')
  async findSome(@Param('isDone') isDone: number) {
    return await this.userService.findSome(isDone);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
