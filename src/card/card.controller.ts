import {Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {Express} from 'express';
import {CardDto} from './card.dto';
import {CardService} from './card.service';
import {CloudinaryService} from "../cloudinary/cloudinary.service";

@Controller('/api/card')
export class CardController {
    constructor(private readonly cardService: CardService,
                private readonly cloudinaryService: CloudinaryService) {
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Express.Multer.File, @Body() cardDto: CardDto) {
        let cloudinaryData = await this.cloudinaryService.uploadImage(file).then((result) => {
            return {
                'url': result.url,
                'publicId': result.public_id
            };
        });
        return await this.cardService.create(cardDto, cloudinaryData.url)
            .catch(() => this.cloudinaryService.deleteImage(cloudinaryData.publicId));
    }

    @Get('/getAll')
    async getAll() {
        return await this.cardService.findAll();
    }

    @Put('/update')
    async update(@UploadedFile() file: Express.Multer.File, @Body() cardDto: CardDto) {
        return await this.cardService.update(cardDto);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: number) {
        return await this.cardService.remove(id).then((result) => {
            return result.raw;
        });

    }
}
