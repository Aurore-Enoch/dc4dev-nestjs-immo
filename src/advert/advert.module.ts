import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertEntity } from './entities/advert.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdvertEntity, CategoryEntity]),
  ],
  controllers: [AdvertController],
  providers: [AdvertService]
})
export class AdvertModule {}
