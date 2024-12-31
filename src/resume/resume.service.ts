import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserResume } from './schema/resume.schema';
import mongoose from 'mongoose';
import { ErrorMessage } from 'shared/error.constant';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from 'shared/helper/helperFunctions';
import { UpdateUserResumeDto } from './dto/update-resume.dto';
import { CreateUserResumeDto } from './dto/create-resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(UserResume.name)
    private UserResumeModel: mongoose.Model<UserResume>,
  ) {}

  // Method for get UserResumes by  user ID
  async getUserResumesByUserId(
    id: mongoose.Types.ObjectId,
  ): Promise<UserResume[]> {
    const userResume = await getAll(this.UserResumeModel, { user: id });

    return userResume;
  }

  async getUserResumesByUserIdForPortfolio(
    id: mongoose.Types.ObjectId,
  ): Promise<UserResume[]> {
    const userResumes = await this.UserResumeModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$title',
          data: {
            $push: {
              subtitle: '$subtitle',
              description: '$description',
              points: '$points',
              startYear: '$startYear',
              endYear: '$endYear',
            },
          },
        },
      },
      {
        $addFields: {
          dataLength: { $size: '$data' },
          pointsLength: {
            $sum: {
              $map: {
                input: '$data',
                as: 'item',
                in: { $size: '$$item.points' },
              },
            },
          },
          earliestStartYear: { $min: '$data.startYear' },
          latestEndYear: { $max: '$data.endYear' },
        },
      },
      {
        $addFields: {
          data: {
            $map: {
              input: {
                $sortArray: {
                  input: '$data',
                  sortBy: { startYear: -1, endYear: -1 },
                },
              },
              as: 'item',
              in: '$$item',
            },
          },
        },
      },
      {
        $sort: {
          earliestStartYear: 1,
          latestEndYear: 1,
          dataLength: -1,
          pointsLength: -1,
        },
      },
      {
        $project: {
          title: '$_id',
          _id: 0,
          data: 1,
        },
      },
    ]);

    return userResumes;
  }

  // Method for get UserResumes by ID
  async getUserResumeById(id: mongoose.Types.ObjectId): Promise<UserResume> {
    const userResume = await getOne(this.UserResumeModel, id, '_id');

    if (!userResume) {
      throw new NotFoundException(ErrorMessage.USER_RESUME_NOT_FOUND);
    }
    return userResume;
  }

  // Method for create UserResume
  async createResume(
    userId: mongoose.Types.ObjectId,
    data: CreateUserResumeDto,
  ): Promise<UserResume> {
    const resume = await createOne(this.UserResumeModel, {
      ...data,
      user: userId,
    });

    if (!resume) {
      throw new BadRequestException(ErrorMessage.USER_RESUME_NOT_CREATE);
    }
    return resume;
  }

  // Method for update UserResume by ID
  async updateResume(
    userId: mongoose.Types.ObjectId,
    data: UpdateUserResumeDto,
    id: mongoose.Types.ObjectId,
  ): Promise<UserResume> {
    const resume = await updateOne(this.UserResumeModel, id, {
      ...data,
      user: userId,
    });

    if (!resume) {
      throw new BadRequestException(ErrorMessage.USER_RESUME_NOT_UPDATED);
    }

    return resume;
  }

  // Method for delete UserResume by ID
  async deleteResume(id: mongoose.Types.ObjectId) {
    const resume = await deleteOne(this.UserResumeModel, id);

    if (!resume) {
      throw new BadRequestException(ErrorMessage.USER_RESUME_NOT_DELETED);
    }
  }
}
