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
import { SkillService } from './skill.service';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UserSkill } from './schema/skill.schema';
import { CreateUserSkillDto } from './dto/create-skill.dto';
import mongoose from 'mongoose';
import { UpdateUserSkillDto } from './dto/update-skill.to';
import { ErrorMessage } from 'shared/error.constant';

@Controller('user-skill')
export class SkillController {
  constructor(private userSkillService: SkillService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserSkill(@Req() req: any): Promise<{ userSkill: UserSkill }> {
    return await this.userSkillService.getUserSkillById(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUserAbout(
    @Req() req: any,
    @Body() createData: CreateUserSkillDto,
  ): Promise<{ userSkill: UserSkill }> {
    return this.userSkillService.upSertUserSkill(
      req.user.id,
      createData,
      'create',
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserAbout(
    @Req() req: any,
    @Body() updateData: UpdateUserSkillDto,
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<{ userSkill: UserSkill }> {
    if (req.user.id !== id) {
      throw new BadRequestException(ErrorMessage.INVALID_ID);
    }

    return this.userSkillService.upSertUserSkill(
      req.user.id,
      updateData,
      'update',
      id,
    );
  }
}
