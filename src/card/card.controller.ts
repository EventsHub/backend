import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CardDto } from './card.dto';
import { CardService } from './card.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Card } from './card.entity';

@Controller('/api/card')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }
  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() cardDto: CardDto) {
    const cloudinaryData = await this.cloudinaryService.uploadImage(file).then((result) => {
      return {
        url: result.url,
      };
    });
    return await this.cardService
      .create(cardDto, cloudinaryData.url)
      .catch(() => this.cloudinaryService.deleteImage(cloudinaryData.url));
  }

  @Get('/getPage')
  async getPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Card>> {
    limit = limit > 100 ? 100 : limit;
    return await this.cardService.paginate({
      page,
      limit,
    });
  }

  @Put('/update')
  @UseInterceptors(FileInterceptor('file'))
  async update(@UploadedFile() file: Express.Multer.File, @Body() cardDto: CardDto) {
    if (!cardDto.id) return Promise.reject("Undefined ID");

    const card = await this.cardService.findById(cardDto.id);
    await this.cloudinaryService.deleteImage(card.urlImage);

    const cloudinaryData = await this.cloudinaryService.uploadImage(file).then((result) => {
      return {
        url: result.url,
        publicId: result.public_id,
      };
    });

    return await this.cardService.update(cardDto, cloudinaryData.url);
  }

  @Delete('/delete')
  async delete(@Query('id') id: number) {
    return await this.cardService
      .remove(id)
      .then((card) => {
        if (card && card.urlImage) {
          this.cloudinaryService.deleteImage(card.urlImage);
        }
        return 'Deleted';
      })
      .catch((err) => {
        return err;
      });
  }
}
