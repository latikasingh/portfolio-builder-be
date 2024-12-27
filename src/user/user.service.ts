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

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: mongoose.Model<User>,
  ) {}

  // Method for creation token
  async createToken(user: User): Promise<string> {
    const payload = { email: user.email, id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
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
  ): Promise<{ user: User }> {
    console.log(updateData);
    const user = await updateOne(this.UserModel, id, updateData);
    if (!user) {
      throw new BadRequestException(ErrorMessage.USER_NOT_UPDATED);
    }
    return { user };
  }

  async logout(token: string) {
    const decodedToken = this.jwtService.decode(token);
    const jti = decodedToken['jti'];
  }
}
