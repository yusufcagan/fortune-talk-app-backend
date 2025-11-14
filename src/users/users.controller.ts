import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    email: string;
    createdAt: string;
  };
}

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
        createdAt: '2025-11-13T14:41:23.675Z',
      },
    },
  })
  getProfile(@Request() req: AuthenticatedRequest) {
    return this.userSevice.findById(req.user.id);
  }
}
