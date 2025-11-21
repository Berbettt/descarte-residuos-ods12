import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisposalRecord } from '../disposal-records/schemas/disposal-record.schema';
import { DisposalPoint } from '../disposal-points/schemas/disposal-point.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(DisposalRecord.name)
    private recordModel: Model<DisposalRecord>,
    @InjectModel(DisposalPoint.name) private pointModel: Model<DisposalPoint>,
  ) {}

  async getDashboardData() {
    const totalDisposalPoints = await this.pointModel.countDocuments({});
    const uniqueUsers = await this.recordModel.distinct('userName');

    const topPointData = await this.recordModel.aggregate([
      { $group: { _id: '$disposalPoint', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'disposalpoints',
          localField: '_id',
          foreignField: '_id',
          as: 'details',
        },
      },
      { $unwind: '$details' },
    ]);

    const topWasteData = await this.recordModel.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const countLast30 = await this.recordModel.countDocuments({
      date: { $gte: thirtyDaysAgo },
    });

    // Comparativo mensal
    const now = new Date();
    const curMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevDate.getFullYear()}-${(prevDate.getMonth() + 1).toString().padStart(2, '0')}`;

    const countCur = await this.recordModel.countDocuments({
      recordMonthYear: curMonth,
    });
    const countPrev = await this.recordModel.countDocuments({
      recordMonthYear: prevMonth,
    });

    let growth = 0;
    if (countPrev === 0) growth = countCur > 0 ? 100 : 0;
    else growth = ((countCur - countPrev) / countPrev) * 100;

    return {
      topDisposalPoint: topPointData[0]?.details?.name || 'N/A',
      mostFrequentWasteType: topWasteData[0]?._id || 'N/A',
      averageDailyDisposalsLast30Days: parseFloat(
        (countLast30 / 30).toFixed(2),
      ),
      totalUsers: uniqueUsers.length,
      totalDisposalPoints,
      monthlyChangePercentage: parseFloat(growth.toFixed(2)),
    };
  }
}
