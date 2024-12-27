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
import { ResumeService } from './resume.service';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UserResume } from './schema/resume.schema';
import { CreateUserResumeDto } from './dto/create-resume.dto';
import { UpdateUserSkillDto } from 'src/skill/dto/update-skill.to';
import { ErrorMessage } from 'shared/error.constant';

@Controller('user-resume')
export class ResumeController {
  constructor(private userResemeService: ResumeService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserResume(@Req() req: any): Promise<{ userResume: UserResume }> {
    return await this.userResemeService.getUserResumeById(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUserResume(
    @Req() req: any,
    @Body() createData: CreateUserResumeDto,
  ): Promise<{ userResume: UserResume }> {
    return this.userResemeService.upSertUserResume(
      req.user.id,
      createData,
      'create',
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserResume(
    @Req() req: any,
    @Body() updateData: UpdateUserSkillDto,
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<{ userResume: UserResume }> {
    if (req.user.id !== id) {
      throw new BadRequestException(ErrorMessage.INVALID_ID);
    }

    return this.userResemeService.upSertUserResume(
      req.user.id,
      updateData,
      'update',
      id,
    );
  }
}
