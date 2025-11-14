import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FortunesModule } from './fortunes/fortunes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANGUAGE') || 'en',
        loaderOptions: {
          path: path.join(process.cwd(), 'src/i18n'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
    UsersModule,
    FortunesModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
