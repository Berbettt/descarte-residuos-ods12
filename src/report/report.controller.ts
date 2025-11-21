import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('relatorio')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getReport() {
    return this.reportService.getDashboardData();
  }
}
