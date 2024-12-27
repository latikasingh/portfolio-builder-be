import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserProject } from './schema/project.schema';
import mongoose from 'mongoose';
import { getOne, updateOne, upSertOne } from 'shared/helper/helperFunctions';
import { ErrorMessage } from 'shared/error.constant';
import { UpdateUserProjectDto } from './dto/update-project.dto';
import { CreateUserProjectDto } from './dto/create-project.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(UserProject.name)
    private UserProjectModel: mongoose.Model<UserProject>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Method for get UserProject by ID
  async getUserProjectById(
    id: mongoose.Types.ObjectId,
  ): Promise<{ userProject: UserProject }> {
    const userProject = await getOne(this.UserProjectModel, id, 'user');
    if (!userProject) {
      throw new NotFoundException(ErrorMessage.USER_PROJECT_NOT_FOUND);
    }
    return { userProject };
  }

  // Method for upsert UserProject
  async upSertUserProject(
    userId: mongoose.Types.ObjectId,
    data: CreateUserProjectDto | UpdateUserProjectDto,
    type: 'create' | 'update',
    files?: any,
    id?: mongoose.Types.ObjectId,
  ): Promise<{ userProject: UserProject }> {
    let userProject;

    if (files?.projectImages && files.projectImages.length > 0) {
      const uploadedImages = await Promise.all(
        files.projectImages.map(async (image) => {
          return this.cloudinaryService.uploadImage(image);
        }),
      );

      data.projectImages = uploadedImages;
    }

    if (type === 'create') {
      userProject = await upSertOne(this.UserProjectModel, userId, {
        ...data,
        user: userId,
      });
    } else {
      userProject = await upSertOne(this.UserProjectModel, id, data);
    }

    if (!userProject) {
      throw new BadRequestException(
        type === 'create'
          ? ErrorMessage.USER_PROJECT_NOT_CREATE
          : ErrorMessage.USER_PROJECT_NOT_UPDATED,
      );
    }
    return { userProject };
  }
}
