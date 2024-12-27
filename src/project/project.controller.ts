import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { ProjectService } from './project.service';
import { CreateUserProjectDto } from './dto/create-project.dto';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UserProject } from './schema/project.schema';
import { UpdateUserProjectDto } from './dto/update-project.dto';
import { ErrorMessage } from 'shared/error.constant';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('user-project')
export class ProjectController {
  constructor(private userProjectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserProject(@Req() req: any): Promise<{ userProject: UserProject }> {
    return await this.userProjectService.getUserProjectById(req.user.id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'projectImages', maxCount: 10 }]),
  )
  @UseGuards(AuthGuard)
  @Post()
  async createUserAbout(
    @Req() req: any,
    @Body() createData: CreateUserProjectDto,
    @UploadedFiles() files?: { projectImages?: Express.Multer.File[] },
  ): Promise<{ userProject: UserProject }> {
    return this.userProjectService.upSertUserProject(
      req.user.id,
      createData,
      'create',
      files,
    );
  }

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'projectImages', maxCount: 10 }]),
  )
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserAbout(
    @Req() req: any,
    @Body() updateData: UpdateUserProjectDto,
    @Param('id') id: mongoose.Types.ObjectId,
    @UploadedFiles() files?: { projectImages?: Express.Multer.File[] },
  ): Promise<{ userProject: UserProject }> {
    if (req.user.id !== id) {
      throw new BadRequestException(ErrorMessage.INVALID_ID);
    }

    return this.userProjectService.upSertUserProject(
      req.user.id,
      updateData,
      'update',
      files,
      id,
    );
  }
}
