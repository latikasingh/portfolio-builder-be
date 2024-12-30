import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class UserResume extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  points: string[];

  @Prop({ type: String })
  startYear?: string;

  @Prop({ type: String })
  endYear?: string;
}

export const UserResumeSchema = SchemaFactory.createForClass(UserResume);

UserResumeSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserResumeSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
