import { Prop } from '@nestjs/mongoose';

export class UserServiceData {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  svg: string;
}
