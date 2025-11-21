import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class BuyMembershipDto {
  @ApiProperty({
    description: 'Membership package type',
    enum: ['weekly', 'monthly', 'yearly', 'credit10'],
    example: 'monthly',
  })
  @IsString()
  @IsIn(['weekly', 'monthly', 'yearly', 'credit10'])
  packageType: 'weekly' | 'monthly' | 'yearly' | 'credit10';
}
