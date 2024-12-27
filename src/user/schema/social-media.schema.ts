import { Prop } from '@nestjs/mongoose';

export class SocialMediaSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  link: string;

  @Prop()
  icon?: string;
}
