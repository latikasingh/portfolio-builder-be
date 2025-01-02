import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';
import { SignUpUserDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  createOne,
  getAll,
  getOneById,
  updateOne,
} from 'shared/helper/helperFunctions';
import { SignInUserDto } from './dto/sign-in.dto';
import { ErrorMessage } from 'shared/error.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Token } from './schema/token.schema';
import { Themes } from './schema/themes.schema';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
    @InjectModel(Themes.name) private ThemesModel: mongoose.Model<Themes>,
    @InjectModel(Token.name) private TokenModel: mongoose.Model<Token>,
  ) {}

  // Method for creation token
  async createToken(user: User): Promise<string> {
    const payload = { email: user.email, id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async getCurrentTheme(userId: string) {
    const user = await this.UserModel.findById(userId);
    const theme = await this.ThemesModel.findById(user.theme);

    return theme;
  }

  async setTheme(id: string, userId: string): Promise<{ user: User }> {
    const updatedUser = await this.UserModel.findOneAndUpdate(
      { _id: userId },
      { theme: id },
      { new: true },
    );

    return { user: updatedUser };
  }

  // Method to handle user signup
  async signup(
    userData: SignUpUserDto,
  ): Promise<{ user: User; token: string }> {
    const { email } = userData;

    let user = null;
    // Check if the user already exists based on email
    user = await this.getUser(email);

    if (user) {
      throw new BadRequestException(ErrorMessage.USER_EXIST);
    }

    user = await this.createUser(userData);
    if (!user) {
      throw new BadRequestException(ErrorMessage.USER_NOT_CREATE);
    }

    user = user.toObject();
    delete user.password;

    // If authentication is successful, generate JWT token
    const token = await this.createToken(user);

    return { user, token };
  }

  // Method to handle user login
  async signIn(
    signInData: SignInUserDto,
  ): Promise<{ user: User; token: string }> {
    const { email } = signInData;

    // Retrieve user information  based on email
    let user = await this.getUser(email, '+password');

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (!(await bcrypt.compare(signInData.password, user.password))) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    user = user.toObject();
    delete user.password;

    // If authentication is successful, generate JWT token
    const token = await this.createToken(user);

    // Send user data and token in response
    return { user, token };
  }

  // Method for get user by Email and return specific data
  async getUser(email: string, selectString?: string): Promise<User> {
    const user = await this.UserModel.findOne({ email }).select(selectString);

    return user;
  }

  // Method for get user by ID
  async getUserById(id: mongoose.Types.ObjectId): Promise<{ user: User }> {
    const user = await getOneById(this.UserModel, id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    return { user };
  }

  // Method for get all user
  async getAllUser(): Promise<User[]> {
    const users = await getAll(this.UserModel);

    if (!users || users.length === 0) {
      throw new NotFoundException(ErrorMessage.USER_RECORDS_NOT_FOUND);
    }
    return users;
  }

  // Method for create user
  async createUser(data: SignUpUserDto): Promise<User> {
    const user = await createOne(this.UserModel, data);

    if (!user) {
      throw new BadRequestException(ErrorMessage.USER_NOT_CREATE);
    }

    return user;
  }

  // Method for update user
  async updateUser(
    id: mongoose.Types.ObjectId,
    updateData: UpdateUserDto,
    files?: any,
  ): Promise<{ user: User }> {
    let data = updateData;
    if (files?.profileImage && files?.profileImage?.length > 0) {
      const profileImageUrl = await this.cloudinaryService.uploadImage(
        files.profileImage[0],
      );
      updateData.profileImage = profileImageUrl;
    }
    // Process coverImage
    if (files?.coverImage && files?.coverImage?.length > 0) {
      const coverImageUrl = await this.cloudinaryService.uploadImage(
        files.coverImage[0],
      );
      updateData.coverImage = coverImageUrl;
    }

    const user = await updateOne(this.UserModel, id, data);
    if (!user) {
      throw new BadRequestException(ErrorMessage.USER_NOT_UPDATED);
    }
    return { user };
  }

  async logout(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const expiresAt = new Date(payload.exp * 1000);
    createOne(this.TokenModel, { token, expiresAt });
  }

  async isTokenBlocked(token: string): Promise<boolean> {
    const blockedToken = await this.TokenModel.findOne({ token });
    return !!blockedToken;
  }
}
