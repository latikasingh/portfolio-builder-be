import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SocialMediaSchema } from './social-media.schema';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { bcryptPassword } from 'shared/helper/helperFunctions';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: [String], default: ['Photographer', 'Freelance', 'Developer'] })
  tags: string[];

  @Prop({ type: [SocialMediaSchema], required: true })
  socialMedia: SocialMediaSchema[];

  @Prop({
    default:
      'https://res.cloudinary.com/drp14sj0v/image/upload/v1735281668/Cover_Image.jpg',
  })
  coverImage?: string;

  @Prop({
    default:
      'https://res.cloudinary.com/drp14sj0v/image/upload/v1735281637/Profile_Image.png',
  })
  profileImage?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Themes',
    required: true,
    default: '677633f586840bf56725a510',
  })
  theme: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre middlaware for password encoding
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptPassword(this.password);

  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
