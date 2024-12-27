import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserSkillData } from './skills-data.sto';

@Schema()
export class UserSkill extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  description: string;
  @Prop({
    type: [UserSkillData],
    required: true,
  })
  skills: UserSkillData[];
}

export const UserSkillSchema = SchemaFactory.createForClass(UserSkill);
