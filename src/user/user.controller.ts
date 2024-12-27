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
import { SignUpUserDto } from './dto/sign-up.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { SignInUserDto } from './dto/sign-in.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { ErrorMessage } from 'shared/error.constant';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('')
  async getUser(@Req() req: any): Promise<{ user: User }> {
    return await this.userService.getUserById(req.user.id);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<{ user: User }> {
    return await this.userService.getUserById(id);
  }

  @Post('/signup')
  async singup(
    @Body() createUserDto: SignUpUserDto,
  ): Promise<{ user: User; token: string }> {
    return await this.userService.signup(createUserDto);
  }

  @Post('/signin')
  async login(
    @Body() signInUserDto: SignInUserDto,
  ): Promise<{ user: User; token: string }> {
    return await this.userService.signIn(signInUserDto);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async updateUser(
    @Req() req: any,
    @Body() updateData: UpdateUserDto,
    @Param('id') id: mongoose.Types.ObjectId,
    @UploadedFiles()
    files: {
      profileImage?: any;
      coverImage?: any;
    },
  ): Promise<{ user: User }> {
    if (req.user.id !== id) {
      throw new BadRequestException(ErrorMessage.INVALID_ID);
    }
    return await this.userService.updateUser(id, updateData, files);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logOut() {
    return true;
  }
}
