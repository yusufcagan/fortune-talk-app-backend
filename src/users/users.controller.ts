import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/types/request.interface';
import { BuyMembershipDto } from './dto/buy-membership.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userSevice: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns current user',
    schema: {
      example: {
        id: 1,
        email: 'user@mail.com',
        credits: 3,
        dailyCookies: 1,
        createdAt: '2025-11-13T14:41:23.675Z',
      },
    },
  })
  getProfile(@Request() req: AuthenticatedRequest) {
    return this.userSevice.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy-membership')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Buy a membership',
  })
  async buyMembership(
    @Request() req: AuthenticatedRequest,
    @Body() body: BuyMembershipDto,
  ) {
    return this.userSevice.buyMembership(req.user.id, body.packageType);
  }
}
