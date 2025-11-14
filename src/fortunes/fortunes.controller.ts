import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FortunesService } from './fortunes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateFortuneDto } from './dto/create-fortune.dto';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    email: string;
    createdAt: string;
  };
}

@ApiTags('Fortunes')
@Controller('fortunes')
export class FortunesController {
  constructor(private readonly fortunesService: FortunesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Create a new fortune with AI result',
  })
  create(@Request() req: AuthenticatedRequest, @Body() body: CreateFortuneDto) {
    return this.fortunesService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns user fortune history' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.fortunesService.findAllByUser(req.user.id);
  }
}
