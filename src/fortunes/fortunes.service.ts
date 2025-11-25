import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFortuneDto } from './dto/create-fortune.dto';

@Injectable()
export class FortunesService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async create(userId: number, data: CreateFortuneDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    if (user.credits <= 0) {
      return {
        message: 'Krediniz bitmiş! Yeni fal bakabilmek için kredi satın alın.',
        success: false,
      };
    }

    const fortune = await this.prisma.fortune.create({
      data: { ...data, userId },
    });

    const aiResult = await this.generateFortuneResult(
      data.imageBase64,
      data.message,
    );

    const updatedFortune = await this.prisma.fortune.update({
      where: { id: fortune.id },
      data: { result: aiResult },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });

    return {
      message: 'Fal yorumunuz hazır!',
      creditsLeft: user.credits - 1,
      fortune: updatedFortune,
    };
  }

  async openDailyCookie(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        message: 'Kullanıcı bulunamadı',
        success: false,
      };
    }

    if (user.dailyCookies <= 0) {
      return {
        message: 'Krediniz bitmiştir',
        success: false,
      };
    }

    const aiResult = await this.generateCookieFortune();

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        dailyCookies: { decrement: 1 },
        lastCookieDate: new Date(),
      },
    });

    const fortune = await this.prisma.fortune.create({
      data: {
        userId,
        message: 'Günlük Kurabiye falı',
        result: aiResult,
      },
    });

    return {
      message: 'Kurabiye açıldı',
      success: true,
      remainingCookies: user.dailyCookies - 1,
      result: aiResult,
    };
  }

  async findAllByUser(userId: number) {
    return this.prisma.fortune.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        result: true,
        createdAt: true,
      },
    });
  }

  private async generateCookieFortune(): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Sen çok eğlenceli, pozitif ve spritüel bir "Fortune Cookie" yorumcusun. 
          Günlük olarak kullanıcıya motive edici, şaşırtıcı anlamlı ve unic bir kurabiye mesajı üret.`,
          },
          {
            role: 'user',
            content: 'Bugünün kurabiye mesajını üret.',
          },
        ],
        max_tokens: 150,
      });

      return (
        response.choices[0].message?.content ||
        'Bugün için güzel bir enerji hissediyorum!'
      );
    } catch (error) {
      console.error('AI hatası:', error);
      return 'Bugün için kurabiye mesajı oluşturulamadı.';
    }
  }

  private async generateFortuneResult(
    imageBase64: string,
    message?: string,
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Sen enerjisi yüksek, pozitif bir kahve falı yorumcususun. Fotoğraftaki kahve fincanını analiz et, sezgisel ve motive edici bir yorum yaz. Her yorumun unic bir yorum olsun. Eğer fincanı tanıyamazsan "Fincan net değil, yorum yapamıyorum." de.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: message?.trim()
                  ? `Kullanıcının notu: ${message}`
                  : 'Kullanıcı not girmedi. Sadece fincan fotoğrafına göre yorum yap.',
              },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        max_tokens: 300,
      });

      return response.choices[0].message?.content || 'Yorum oluşturulmadı.';
    } catch (error: any) {
      console.error('AI hatası:', error);
      return 'Fal Yorumu oluşturulurken bir hata oluştu';
    }
  }
}
