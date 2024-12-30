import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class UserAbout extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: true })
  designationDescription: string;

  @Prop({ required: true })
  DOB: string;

  @Prop({ required: true })
  age: number;

  @Prop()
  website: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: false })
  freelancer: boolean;

  @Prop({ default: 0 })
  happyClient: number;

  @Prop({ default: 0 })
  projects: number;

  @Prop({ default: 0 })
  hoursOfSupports: number;

  @Prop({ default: 0 })
  team: number;
}

export const UserAboutSchema = SchemaFactory.createForClass(UserAbout);

UserAboutSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserAboutSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
