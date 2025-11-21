import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisposalPoint } from './schemas/disposal-point.schema';
import { CreateDisposalPointDto } from './dto/create-disposal-point.dto';

@Injectable()
export class DisposalPointsService {
  constructor(
    @InjectModel(DisposalPoint.name)
    private disposalPointModel: Model<DisposalPoint>,
  ) {}

  async create(createDto: CreateDisposalPointDto): Promise<DisposalPoint> {
    const createdPoint = new this.disposalPointModel(createDto);
    return createdPoint.save();
  }

  async findAll(): Promise<DisposalPoint[]> {
    return this.disposalPointModel.find().exec();
  }

  async findById(id: string): Promise<DisposalPoint | null> {
    return this.disposalPointModel.findById(id).exec();
  }
}
