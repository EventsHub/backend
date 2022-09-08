import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardController } from './card.controller';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CardTransformer } from './card.transformer';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardController],
  providers: [CardService, CloudinaryService, CardTransformer],
})
export class CardModule {}
