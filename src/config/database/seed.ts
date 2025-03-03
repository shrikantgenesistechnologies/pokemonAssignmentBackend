import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder.service';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { AppConfigModule } from '../config.module';
config();

async function runSeeder() {
  const app = await NestFactory.createApplicationContext(AppConfigModule);
  const seederService = app.get(SeederService);
  const logger = new Logger('Seeder');

  try {
    await seederService.seed();
    logger.log(' Database seeding completed!');
  } catch (error) {
    logger.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

runSeeder();
