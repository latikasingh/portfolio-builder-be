import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export class Themes extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;
}
export const ThemesSchema = SchemaFactory.createForClass(Themes);
