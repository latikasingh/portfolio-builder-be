import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import mongoose from 'mongoose';
import { UserContact } from './schema/contact.schema';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { CreateUserContactDto } from './dto/create-contact.dto';

@Controller('user-contact')
export class ContactController {
  constructor(private userContactService: ContactService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserAboutById(
    @Req() req: any,
  ): Promise<{ userContact: UserContact }> {
    return await this.userContactService.getUserContactById(req.user.id);
  }

  @Post(':id')
  async createUserAbout(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() createData: CreateUserContactDto,
  ): Promise<{ userContact: UserContact }> {
    return this.userContactService.addUserContact(createData, id);
  }
}
