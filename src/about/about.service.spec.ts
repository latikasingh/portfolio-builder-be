import { Test, TestingModule } from '@nestjs/testing';
import { UserAboutService } from './about.service';

describe('AboutService', () => {
  let service: UserAboutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAboutService],
    }).compile();

    service = module.get<UserAboutService>(UserAboutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
