import { Module } from '@nestjs/common';
import { FortunesService } from './fortunes.service';
import { FortunesController } from './fortunes.controller';

@Module({
  providers: [FortunesService],
  controllers: [FortunesController]
})
export class FortunesModule {}
