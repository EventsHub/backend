import { HttpStatus } from '@nestjs/common';

export class MessageResponseDto {
  constructor(message: string, statusCode: HttpStatus) {
    this.message = message;
    this.statusCode = statusCode;
  }
  statusCode: HttpStatus;
  message: string;
}
