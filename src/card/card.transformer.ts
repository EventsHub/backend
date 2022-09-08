import { Injectable } from '@nestjs/common';
import { CardDto } from './card.dto';
import { Card } from './card.entity';

@Injectable()
export class CardTransformer {
  public toEntity(card: CardDto, urlImage: string = null) {
    const entity = new Card();
    entity.title = card.title;
    entity.description = card.description;
    entity.address = card.address;
    entity.urlImage = urlImage;
    entity.startDate = card.startDate;
    entity.urlOnEvent = card.urlOnEvent;
    return entity;
  }
}
