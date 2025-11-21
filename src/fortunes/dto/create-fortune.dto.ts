import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateFortuneDto {
  @ApiProperty({
    example: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
    description: 'Fortune Photo base64 format',
  })
  @IsString()
  imageBase64: string;

  @ApiProperty({
    example: 'Bugün içimden bir dilek geçirdim...',
    description: 'Kullanıcının fal için yazdığı isteğe bağlı mesaj',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
