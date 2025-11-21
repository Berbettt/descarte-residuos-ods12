import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DisposalPointsModule } from './disposal-points/disposal-points.module';
import { DisposalRecordsModule } from './disposal-records/disposal-records.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    DisposalPointsModule,
    DisposalRecordsModule,
    ReportModule,
  ],
})
export class AppModule {}
