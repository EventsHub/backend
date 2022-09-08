import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CardDto } from './card.dto';
import { Card } from './card.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CardTransformer } from './card.transformer';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @Inject(CardTransformer)
    private readonly cardTransformer: CardTransformer,
  ) {}

  public paginate(options: IPaginationOptions): Promise<Pagination<Card>> {
    return paginate<Card>(this.cardRepository, options);
  }

  public create(cardDto: CardDto, urlImage: string): Promise<Card> {
    const card = this.cardTransformer.toEntity(cardDto, urlImage);
    return this.cardRepository.save(card);
  }

  public update(cardDto: CardDto): Promise<UpdateResult> {
    return this.cardRepository.update(cardDto.id, cardDto);
  }

  async remove(id: number): Promise<Card> {
    return await this.cardRepository
      .findOneBy({
        id: id,
      })
      .then((card) => {
        this.cardRepository.remove(card);
        return card;
      });
  }
}
