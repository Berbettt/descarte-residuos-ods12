import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { DisposalPointsModule } from '../disposal-points/disposal-points.module';
import { DisposalRecordsModule } from '../disposal-records/disposal-records.module';

@Module({
  imports: [DisposalPointsModule, DisposalRecordsModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
