import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisposalRecordsController } from './disposal-records.controller';
import { DisposalRecordsService } from './disposal-records.service';
import {
  DisposalRecord,
  DisposalRecordSchema,
} from './schemas/disposal-record.schema';
import { DisposalPointsModule } from '../disposal-points/disposal-points.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DisposalRecord.name, schema: DisposalRecordSchema },
    ]),
    DisposalPointsModule,
  ],
  controllers: [DisposalRecordsController],
  providers: [DisposalRecordsService],
  exports: [MongooseModule],
})
export class DisposalRecordsModule {}
