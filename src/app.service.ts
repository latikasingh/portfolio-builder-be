import { HttpServer, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserAboutService } from './about/about.service';
import { SkillService } from './skill/skill.service';
import { ResumeService } from './resume/resume.service';
import { ProjectService } from './project/project.service';
import { ServicesService } from './services/services.service';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Themes } from './user/schema/themes.schema';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private userAboutService: UserAboutService,
    private userSkillService: SkillService,
    private userResumeService: ResumeService,
    private userProjectService: ProjectService,
    private userServiceService: ServicesService,
    private httpService: HttpService,
    @InjectModel(Themes.name) private ThemesModel: mongoose.Model<Themes>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllPortfolioData(userId: mongoose.Types.ObjectId) {
    const [user, about, skill, resume, portfolio, service] = await Promise.all([
      this.userService.getUserById(userId),
      this.userAboutService.getUserAboutById(userId),
      this.userSkillService.getUserSkillById(userId),
      this.userResumeService.getUserResumesByUserIdForPortfolio(userId),
      this.userProjectService.getUserProjectByUserId(userId),
      this.userServiceService.getUserServiceById(userId),
    ]);
    return { data: { ...user, about, skill, resume, portfolio, service } };
  }

  async getAllThemes() {
    const themes = await this.ThemesModel.find();
    console.log(themes);

    return themes;
  }

  async searchIcon(
    name: string,
  ): Promise<{ icons: { icon: string; value: string }[] }> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get(`${process.env.API_ICONIFY}/search?query=${name}`)
        .subscribe(
          (res: any) => {
            if (!res?.data?.icons?.length) {
              return resolve({ icons: [] });
            }

            const iconFetchPromises = res.data.icons.map((icon: string) => {
              const [prefix, iconName] = icon.split(':');
              return this.httpService
                .get(`${process.env.API_ICONIFY}/${prefix}/${iconName}.svg`)
                .toPromise()
                .then((svg: any) => ({ value: icon, icon: svg.data }))
                .catch(() => null);
            });

            Promise.all(iconFetchPromises)
              .then((icons) => {
                resolve({ icons: icons.filter((icon) => icon !== null) });
              })
              .catch((error) => reject(error));
          },
          (error) => {
            reject(error);
          },
        );
    });
  }
}
