import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSkillSchema } from './schema/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserSkill', schema: UserSkillSchema }]),
  ],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
