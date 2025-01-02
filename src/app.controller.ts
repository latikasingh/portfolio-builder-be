import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import mongoose from 'mongoose';
import { AuthGuard } from 'shared/auth/auth.gurd';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/theme/:id')
  getCurrentTheme(@Param('id') id: string) {
    return this.userService.getCurrentTheme(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/theme')
  setTheme(@Req() req: any, @Body('id') id: string) {
    return this.userService.setTheme(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/themes')
  getAllThemes() {
    return this.appService.getAllThemes();
  }

  @Get('/portfolio/:id')
  getAllPortfolioData(@Param('id') id: mongoose.Types.ObjectId) {
    return this.appService.getAllPortfolioData(id);
  }

  @Get('/icons/search')
  async getSearchIcon(
    @Query('name') name: string,
  ): Promise<{ icons: { icon: any; value: string }[] }> {
    return await this.appService.searchIcon(name);
  }
}
