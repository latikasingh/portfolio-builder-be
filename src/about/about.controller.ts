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
import mongoose from 'mongoose';
import { UserAboutService } from './about.service';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UpdateUserAboutDto } from './dto/update-about.dto';
import { UserAbout } from './schema/about.schema';
import { ErrorMessage } from 'shared/error.constant';
import { CreateUserAboutDto } from './dto/create-about.dto';

@Controller('user-about')
export class AboutController {
  constructor(private userAboutService: UserAboutService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserAbout(@Req() req: any): Promise<UserAbout> {
    return await this.userAboutService.getUserAboutById(req.user.id);
  }

  @Get(':id')
  async getUserAboutById(
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<UserAbout> {
    return await this.userAboutService.getUserAboutById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUserAbout(
    @Req() req: any,
    @Body() createData: CreateUserAboutDto,
  ): Promise<UserAbout> {
    return this.userAboutService.upSertUserAbout(
      req.user.id,
      createData,
      'create',
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserAbout(
    @Req() req: any,
    @Body() updateData: UpdateUserAboutDto,
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<UserAbout> {
    if (req.user.id !== id) {
      throw new BadRequestException(ErrorMessage.INVALID_ID);
    }

    return this.userAboutService.upSertUserAbout(
      req.user.id,
      updateData,
      'update',
      id,
    );
  }
}
