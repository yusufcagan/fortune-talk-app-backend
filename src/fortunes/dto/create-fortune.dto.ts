import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateFortuneDto {
  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    description: 'Fortune Photo url',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: 'Bugün içimden bir dilek geçirdim...',
    description: 'Kullanıcının fal için yazdığı isteğe bağlı mesaj',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
