import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { ResumeService } from './resume.service';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UserResume } from './schema/resume.schema';
import { CreateUserResumeDto } from './dto/create-resume.dto';
import { UpdateUserResumeDto } from './dto/update-resume.dto';

@Controller('user-resume')
export class ResumeController {
  constructor(private userResemeService: ResumeService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserResume(@Req() req: any): Promise<UserResume[]> {
    return await this.userResemeService.getUserResumesByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUserResume(
    @Req() req: any,
    @Body() createData: CreateUserResumeDto,
  ): Promise<UserResume> {
    return this.userResemeService.createResume(req.user.id, createData);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserResume(
    @Req() req: any,
    @Body() updateData: UpdateUserResumeDto,
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<UserResume> {
    await this.userResemeService.getUserResumeById(id);

    return this.userResemeService.updateResume(req.user.id, updateData, id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUserResume(@Param('id') id: mongoose.Types.ObjectId) {
    this.userResemeService.deleteResume(id);
  }
}
