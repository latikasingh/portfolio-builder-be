import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserContactSchema } from './schema/contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserContact', schema: UserContactSchema },
    ]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
