import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controll';
import { ReportsService } from './reports.service';
@Module({ controllers:[ReportsController], providers:[ReportsService] })
export class ReportsModule {}
