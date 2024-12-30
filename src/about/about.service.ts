import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { UserAbout } from './schema/about.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  calculateAge,
  getAll,
  getOne,
  getOneById,
  upSertOne,
} from 'shared/helper/helperFunctions';
import { ErrorMessage } from 'shared/error.constant';
import { CreateUserAboutDto } from './dto/create-about.dto';
import { UpdateUserAboutDto } from './dto/update-about.dto';

@Injectable()
export class UserAboutService {
  constructor(
    @InjectModel(UserAbout.name)
    private UserAboutModel: mongoose.Model<UserAbout>,
  ) {}

  // Method for get UserAbout by ID
  async getUserAboutById(id: mongoose.Types.ObjectId): Promise<UserAbout> {
    return await getOne(this.UserAboutModel, id, 'user');
  }

  // Method for upsert UserAbout
  async upSertUserAbout(
    userId: mongoose.Types.ObjectId,
    data: CreateUserAboutDto | UpdateUserAboutDto,
    type: 'create' | 'update',
    id?: mongoose.Types.ObjectId,
  ): Promise<UserAbout> {
    let userAbout;

    if (!data.age && data.DOB) {
      data.age = calculateAge(data.DOB);
    }

    if (type === 'create') {
      userAbout = await upSertOne(this.UserAboutModel, userId, {
        ...data,
        user: userId,
      });
    } else {
      userAbout = await upSertOne(this.UserAboutModel, id, data);
    }

    if (!userAbout) {
      throw new BadRequestException(
        type === 'create'
          ? ErrorMessage.USER_ABOUT_NOT_CREATE
          : ErrorMessage.USER_ABOUT_NOT_UPDATED,
      );
    }
    return userAbout;
  }
}
