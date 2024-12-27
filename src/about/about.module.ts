import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { UserAboutService } from './about.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAboutSchema } from './schema/about.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserAbout', schema: UserAboutSchema }]),
  ],
  controllers: [AboutController],
  providers: [UserAboutService],
})
export class AboutModule {}
