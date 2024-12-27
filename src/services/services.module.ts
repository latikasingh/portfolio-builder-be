import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserServiceSchema } from './schema/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserService', schema: UserServiceSchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
