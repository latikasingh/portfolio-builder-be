import { Prop, Schema } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SocialMediaSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  link: string;

  @Prop()
  icon?: string;
}
