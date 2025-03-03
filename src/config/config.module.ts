import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: configuration().envFilePath,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration],
    }),
    DatabaseModule,
  ],
})
export class AppConfigModule {}
