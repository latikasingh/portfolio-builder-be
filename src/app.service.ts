import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserAboutService } from './about/about.service';
import { SkillService } from './skill/skill.service';
import { ResumeService } from './resume/resume.service';
import { ProjectService } from './project/project.service';
import { ServicesService } from './services/services.service';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    // @InjectModel(UserSkill.name)
    // private readonly userSkillModel: Model<UserSkill>,
    // @InjectModel(UserProject.name)
    // private readonly userProjectModel: Model<UserProject>,
    // @InjectModel(UserResume.name)
    // private readonly userResumeModel: Model<UserResume>,

    private userService: UserService,
    private userAboutService: UserAboutService,
    private userSkillService: SkillService,
    private userResumeService: ResumeService,
    private userProjectService: ProjectService,
    private userServiceService: ServicesService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllPortfolioData(userId: mongoose.Types.ObjectId) {
    const [user, about, skill, resume, project, service] = await Promise.all([
      this.userService.getUserById(userId),
      this.userAboutService.getUserAboutById(userId),
      this.userSkillService.getUserSkillById(userId),
      this.userResumeService.getUserResumeById(userId),
      this.userProjectService.getUserProjectById(userId),
      this.userServiceService.getUserServiceById(userId),
    ]);
    return { data: { ...user, about, skill, resume, project, service } };
  }
}
