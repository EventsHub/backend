import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CardDto } from './card.dto';
import { Card } from './card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) { }

  private toEntity(card: CardDto, urlImage: string = null) {
    const entity = new Card();
    entity.title = card.title;
    entity.description = card.description;
    entity.address = card.address;
    entity.urlImage = urlImage;
    entity.startDate = card.startDate;
    entity.urlOnEvent = card.urlOnEvent;
    return entity;
  }

  findAll(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  public create(cardDto: CardDto, urlImage: string): Promise<Card> {
    const card = this.toEntity(cardDto, urlImage);
    return this.cardRepository.save(card);
  }

  public update(cardDto: CardDto): Promise<UpdateResult> {
    return this.cardRepository.update(cardDto.id, cardDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.cardRepository.delete(id);
  }
}
