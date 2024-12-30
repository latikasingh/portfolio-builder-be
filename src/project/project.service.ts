import mongoose from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserProject } from './schema/project.schema';
import {
  createOne,
  getAll,
  getOne,
  updateOne,
} from 'shared/helper/helperFunctions';
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

  // Method for get UserProject by user ID
  async getUserProjectByUserId(
    id: mongoose.Types.ObjectId,
  ): Promise<UserProject[]> {
    const userProject = await getAll(this.UserProjectModel, { user: id });

    return userProject;
  }

  // Method for get UserProject by ID
  async getUserProjectById(id: mongoose.Types.ObjectId): Promise<UserProject> {
    const userProject = await getOne(this.UserProjectModel, id, '_id');
    if (!userProject) {
      throw new NotFoundException(ErrorMessage.USER_PROJECT_NOT_FOUND);
    }

    return userProject;
  }

  // Method for create UserProject
  async createPorject(
    userId: mongoose.Types.ObjectId,
    data: CreateUserProjectDto,
    files?: any,
  ) {
    if (files?.projectImages && files.projectImages.length > 0) {
      const uploadedImages = await Promise.all(
        files.projectImages.map(async (image) => {
          return this.cloudinaryService.uploadImage(image);
        }),
      );

      data.projectImages = uploadedImages;
    }

    const project = await createOne(this.UserProjectModel, {
      ...data,
      user: userId,
    });

    if (!project) {
      throw new BadRequestException(ErrorMessage.USER_PROJECT_NOT_CREATE);
    }
    return project;
  }

  // Method for update UserProject by ID
  async updatePorject(
    userId: mongoose.Types.ObjectId,
    data: UpdateUserProjectDto,
    id: mongoose.Types.ObjectId,
    files?: any,
  ) {
    if (files?.projectImages && files.projectImages.length > 0) {
      const uploadedImages = await Promise.all(
        files.projectImages.map(async (image) => {
          return this.cloudinaryService.uploadImage(image);
        }),
      );

      data.projectImages = uploadedImages;
    }

    const project = await updateOne(this.UserProjectModel, id, {
      ...data,
      user: userId,
    });

    if (!project) {
      throw new BadRequestException(ErrorMessage.USER_PROJECT_NOT_UPDATED);
    }

    return project;
  }
}
