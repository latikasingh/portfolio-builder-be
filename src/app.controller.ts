import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import mongoose from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/portfolio/:id')
  getAllPortfolioData(@Param('id') id: mongoose.Types.ObjectId) {
    return this.appService.getAllPortfolioData(id);
  }
}
