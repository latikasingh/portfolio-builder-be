import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResumeSchema } from './schema/resume.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserResume', schema: UserResumeSchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
