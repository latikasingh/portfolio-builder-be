import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserResume } from './schema/resume.schema';
import mongoose from 'mongoose';
import { ErrorMessage } from 'shared/error.constant';
import { getOne, upSertOne } from 'shared/helper/helperFunctions';
import { UpdateUserResumeDto } from './dto/update-resume.dto';
import { CreateUserResumeDto } from './dto/create-resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(UserResume.name)
    private UserResumeModel: mongoose.Model<UserResume>,
  ) {}

  // Method for get UserResume by ID
  async getUserResumeById(
    id: mongoose.Types.ObjectId,
  ): Promise<{ userResume: UserResume }> {
    const userResume = await getOne(this.UserResumeModel, id, 'user');

    if (!userResume) {
      throw new NotFoundException(ErrorMessage.USER_RESUME_NOT_FOUND);
    }
    return { userResume };
  }

  // Method for upsert UserResume
  async upSertUserResume(
    userId: mongoose.Types.ObjectId,
    data: CreateUserResumeDto | UpdateUserResumeDto,
    type: 'create' | 'update',
    id?: mongoose.Types.ObjectId,
  ): Promise<{ userResume: UserResume }> {
    let userResume;

    if (type === 'create') {
      userResume = await upSertOne(this.UserResumeModel, userId, {
        ...data,
        user: userId,
      });
    } else {
      userResume = await upSertOne(this.UserResumeModel, id, data);
    }

    if (!userResume) {
      throw new BadRequestException(
        type === 'create'
          ? ErrorMessage.USER_RESUME_NOT_CREATE
          : ErrorMessage.USER_RESUME_NOT_UPDATED,
      );
    }
    return { userResume };
  }
}
