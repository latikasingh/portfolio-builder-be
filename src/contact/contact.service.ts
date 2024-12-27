import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserContact } from './schema/contact.schema';
import { createOne, getOne } from 'shared/helper/helperFunctions';
import { ErrorMessage } from 'shared/error.constant';
import { CreateUserContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(UserContact.name)
    private UserContactModel: mongoose.Model<UserContact>,
  ) {}

  // Method for get UserContact by ID
  async getUserContactById(
    id: mongoose.Types.ObjectId,
  ): Promise<{ userContact: UserContact }> {
    const userContact = await getOne(this.UserContactModel, id, 'user');

    return { userContact };
  }

  // Method for add UserContact data
  async addUserContact(
    data: CreateUserContactDto,
    userId: string,
  ): Promise<{ userContact: UserContact }> {
    const userContact = await createOne(this.UserContactModel, {
      ...data,
      user: userId,
    });
    if (!userContact) {
      throw new BadRequestException(ErrorMessage.USER_ABOUT_NOT_CREATE);
    }
    return { userContact };
  }
}
