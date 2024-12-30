import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSkill } from './schema/skill.schema';
import mongoose from 'mongoose';
import { getOne, upSertOne } from 'shared/helper/helperFunctions';
import { ErrorMessage } from 'shared/error.constant';
import { CreateUserSkillDto } from './dto/create-skill.dto';
import { UpdateUserSkillDto } from './dto/update-skill.to';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(UserSkill.name)
    private UserSkillModel: mongoose.Model<UserSkill>,
  ) {}

  // Method for get UserSkill by ID
  async getUserSkillById(id: mongoose.Types.ObjectId): Promise<UserSkill> {
    const userSkill = await getOne(this.UserSkillModel, id, 'user');

    if (!userSkill) {
      throw new NotFoundException(ErrorMessage.USER_SKILL_NOT_FOUND);
    }
    return userSkill;
  }

  // Method for upsert UserSKill
  async upSertUserSkill(
    userId: mongoose.Types.ObjectId,
    data: CreateUserSkillDto | UpdateUserSkillDto,
    type: 'create' | 'update',
    id?: mongoose.Types.ObjectId,
  ): Promise<UserSkill> {
    let userSkill;

    if (type === 'create') {
      userSkill = await upSertOne(this.UserSkillModel, userId, {
        ...data,
        user: userId,
      });
    } else {
      userSkill = await upSertOne(this.UserSkillModel, id, data);
    }

    if (!userSkill) {
      throw new BadRequestException(
        type === 'create'
          ? ErrorMessage.USER_SKILL_NOT_CREATE
          : ErrorMessage.USER_SKILL_NOT_UPDATED,
      );
    }
    return userSkill;
  }
}
