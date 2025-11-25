import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDailyCookies() {
    this.logger.log('daily cookies resetting');

    try {
      await this.prisma.user.updateMany({
        data: {
          dailyCookies: 3,
          lastCookieDate: new Date(),
        },
      });
      this.logger.log('Daily cookies reset');
    } catch (error) {
      this.logger.error('error cron', error);
    }
  }
}
