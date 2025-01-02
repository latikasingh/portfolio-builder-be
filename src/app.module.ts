import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SkillModule } from './skill/skill.module';
import { AboutModule } from './about/about.module';
import { ServicesModule } from './services/services.module';
import { ProjectModule } from './project/project.module';
import { ContactModule } from './contact/contact.module';
import { HttpModule } from '@nestjs/axios';
import { ThemesSchema } from './user/schema/themes.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRESIN },
    }),
    MongooseModule.forFeature([{ name: 'Themes', schema: ThemesSchema }]),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    HttpModule,
    UserModule,
    AboutModule,
    SkillModule,
    ResumeModule,
    CloudinaryModule,
    ServicesModule,
    ProjectModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
