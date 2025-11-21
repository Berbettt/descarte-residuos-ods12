import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisposalRecord } from './schemas/disposal-record.schema';
import { CreateDisposalRecordDto } from './dto/create-disposal-record.dto';
import { DisposalPointsService } from '../disposal-points/disposal-points.service';

@Injectable()
export class DisposalRecordsService {
  constructor(
    @InjectModel(DisposalRecord.name)
    private recordModel: Model<DisposalRecord>,
    private pointsService: DisposalPointsService,
  ) {}

  async create(createDto: CreateDisposalRecordDto): Promise<DisposalRecord> {
    // Verifica se o ponto de descarte existe mesmo
    const point = await this.pointsService.findById(createDto.disposalPointId);
    if (!point) {
      throw new NotFoundException('Ponto de descarte não encontrado.');
    }

    const createdRecord = new this.recordModel({
      ...createDto,
      disposalPoint: createDto.disposalPointId,
    });
    return createdRecord.save();
  }

  async findAllFiltered(query: any): Promise<DisposalRecord[]> {
    const filter: any = {};

    if (query.disposalPointId) filter.disposalPoint = query.disposalPointId;
    if (query.wasteType) filter.wasteType = query.wasteType;
    if (query.userName)
      filter.userName = { $regex: query.userName, $options: 'i' };

    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) filter.date.$gte = new Date(query.startDate);
      if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }

    return this.recordModel
      .find(filter)
      .populate('disposalPoint')
      .sort({ date: -1 })
      .exec();
  }
}
