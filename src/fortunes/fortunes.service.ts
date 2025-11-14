import { Injectable } from '@nestjs/common';
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
    const fortune = await this.prisma.fortune.create({
      data: { ...data, userId },
    });

    const aiResult = await this.generateFortuneResult(data.message);

    const updatedFortune = await this.prisma.fortune.update({
      where: { id: fortune.id },
      data: { result: aiResult },
    });

    return updatedFortune;
  }

  async findAllByUser(userId: number) {
    return this.prisma.fortune.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async generateFortuneResult(message?: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Sen enerjisi yüksek, pozitif, sezgisel bir fal yorumcususun. Kullanıcının mesajına göre kısa ama anlamlı, umut dolu bir kahve falı yorumu yaz.',
          },
          {
            role: 'user',
            content: message || 'Yorum yok',
          },
        ],
      });

      return response.choices[0].message?.content || 'Yorum oluşturulmadı.';
    } catch (error: any) {
      console.error('AI hatası:', error);
      return 'Fal Yorumu oluşturulurken bir hata oluştu';
    }
  }
}
