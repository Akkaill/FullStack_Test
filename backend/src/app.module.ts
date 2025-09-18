import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentsModule } from './modules/students/students.module'
import { RoomsModule } from './modules/rooms/rooms.module';
import { MembershipsModule } from './modules/membership/membership.module'
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: false, 
        logging: true,
      }),
    }),
    StudentsModule,
    RoomsModule,
    MembershipsModule,
    ReportsModule,
  ],
})
export class AppModule {}
