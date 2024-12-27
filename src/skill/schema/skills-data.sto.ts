import { Prop } from '@nestjs/mongoose';

export class UserSkillData {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  percentage: number;
}
