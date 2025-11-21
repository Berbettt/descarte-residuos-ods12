import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DisposalRecordsService } from './disposal-records.service';
import { CreateDisposalRecordDto } from './dto/create-disposal-record.dto';

@Controller('disposal-records')
export class DisposalRecordsController {
  constructor(private readonly service: DisposalRecordsService) {}

  @Post()
  create(@Body() createDto: CreateDisposalRecordDto) {
    return this.service.create(createDto);
  }

  @Get('history')
  async getHistory(@Query() query) {
    return this.service.findAllFiltered(query);
  }
}
