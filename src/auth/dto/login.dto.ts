import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  @IsString()
  password: string;
}
