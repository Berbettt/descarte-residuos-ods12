import { Controller, Post, Body, Get } from '@nestjs/common';
import { DisposalPointsService } from './disposal-points.service';
import { CreateDisposalPointDto } from './dto/create-disposal-point.dto';

@Controller('disposal-points')
export class DisposalPointsController {
  constructor(private readonly service: DisposalPointsService) {}

  @Post()
  create(@Body() createDto: CreateDisposalPointDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
