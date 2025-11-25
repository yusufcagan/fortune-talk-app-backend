import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    let user = await this.prisma.user.findUnique({ where: { id } });

    const today = new Date().toISOString().slice(0, 10);
    const last = user?.lastCookieDate
      ? user.lastCookieDate.toISOString().slice(0, 10)
      : null;

    if (last !== today) {
      await this.prisma.user.update({
        where: { id },
        data: {
          dailyCookies: 1,
          lastCookieDate: new Date(),
        },
      });

      user = await this.prisma.user.findUnique({ where: { id } });
    }

    return {
      id: user?.id,
      email: user?.email,
      credits: user?.credits,
      dailyCookies: user?.dailyCookies,
      createdAt: user?.createdAt,
    };
  }

  async buyMembership(
    userId: number,
    packageType: 'weekly' | 'monthly' | 'yearly' | 'credit10',
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('kullanıcı bulunamadı');

    let creditsToAdd = 0;
    let durationDays = 0;

    switch (packageType) {
      case 'weekly':
        creditsToAdd = 100;
        durationDays = 7;
        break;
      case 'monthly':
        creditsToAdd = 100;
        durationDays = 30;
        break;
      case 'yearly':
        creditsToAdd = 100;
        durationDays = 365;
        break;
      case 'credit10':
        creditsToAdd = 10;
        durationDays = 0;
        break;
      default:
        throw new BadRequestException('Geçersiz Paket');
    }

    const now = new Date();
    const membershipEndsAt = durationDays
      ? new Date(now.setDate(now.getDate()) + durationDays)
      : null;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: creditsToAdd },
        membership: packageType !== 'credit10' ? packageType : null,
        membershipEndsAt: membershipEndsAt,
        purchases: {
          create: {
            packageType,
            credits: creditsToAdd,
            expiresAt: membershipEndsAt,
          },
        },
      },
    });

    return {
      message: `🎉 ${packageType} paketi başarıyla aktif edildi!`,
      creditsToAdd: creditsToAdd,
      creditsTotal: updatedUser.credits,
      membershipEndAt: membershipEndsAt,
    };
  }
}
