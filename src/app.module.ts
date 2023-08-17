import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConifg } from 'config/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConifg)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
