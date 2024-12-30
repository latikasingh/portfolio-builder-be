import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ErrorMessage } from 'shared/error.constant';
import { getOne, upSertOne } from 'shared/helper/helperFunctions';
import { CreateUserServiceDto } from './dto/create-service.dto';
import { UpdateUserServiceDto } from './dto/update-service.dto';
import { UserService } from './schema/service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(UserService.name)
    private UserServiceModel: mongoose.Model<UserService>,
  ) {}

  // Method for get UserService by ID
  async getUserServiceById(id: mongoose.Types.ObjectId): Promise<UserService> {
    const userService = await getOne(this.UserServiceModel, id, 'user');

    return userService;
  }

  // Method for upsert UserSKill
  async upSertUserService(
    userId: mongoose.Types.ObjectId,
    data: CreateUserServiceDto | UpdateUserServiceDto,
    type: 'create' | 'update',
    id?: mongoose.Types.ObjectId,
  ): Promise<UserService> {
    let userService;

    if (type === 'create') {
      userService = await upSertOne(this.UserServiceModel, userId, {
        ...data,
        user: userId,
      });
    } else {
      userService = await upSertOne(this.UserServiceModel, id, data);
    }

    if (!userService) {
      throw new BadRequestException(
        type === 'create'
          ? ErrorMessage.USER_SERVICE_NOT_CREATE
          : ErrorMessage.USER_SERVICE_NOT_UPDATED,
      );
    }
    return userService;
  }
}
