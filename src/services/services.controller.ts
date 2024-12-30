import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UserService } from './schema/service.schema';
import { CreateUserServiceDto } from './dto/create-service.dto';
import mongoose from 'mongoose';
import { UpdateUserServiceDto } from './dto/update-service.dto';
import { ErrorMessage } from 'shared/error.constant';

@Controller('user-service')
export class ServicesController {
  constructor(private userServiceService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserService(@Req() req: any): Promise<UserService> {
    return await this.userServiceService.getUserServiceById(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUserAbout(
    @Req() req: any,
    @Body() createData: CreateUserServiceDto,
  ): Promise<UserService> {
    return this.userServiceService.upSertUserService(
      req.user.id,
      createData,
      'create',
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserAbout(
    @Req() req: any,
    @Body() updateData: UpdateUserServiceDto,
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<UserService> {
    if (req.user.id !== id) {
      throw new BadRequestException(ErrorMessage.INVALID_ID);
    }

    return this.userServiceService.upSertUserService(
      req.user.id,
      updateData,
      'update',
      id,
    );
  }
}
