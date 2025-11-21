import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisposalPointsController } from './disposal-points.controller';
import { DisposalPointsService } from './disposal-points.service';
import {
  DisposalPoint,
  DisposalPointSchema,
} from './schemas/disposal-point.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DisposalPoint.name, schema: DisposalPointSchema },
    ]),
  ],
  controllers: [DisposalPointsController],
  providers: [DisposalPointsService],
  exports: [DisposalPointsService, MongooseModule],
})
export class DisposalPointsModule {}
