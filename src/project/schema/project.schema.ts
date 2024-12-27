import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserProject extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description_title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  projectImages?: string[];

  @Prop()
  link: string;
}

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);

UserProjectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserProjectSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
