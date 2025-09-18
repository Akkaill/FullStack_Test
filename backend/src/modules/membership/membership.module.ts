import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMembership } from './membership.entity';
import { MembershipsService } from './membership.service';
import { MembershipsController } from './membership.controller';
import { Room } from '../rooms/rooms.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RoomMembership, Room])],
  controllers:[MembershipsController],
  providers:[MembershipsService],
})
export class MembershipsModule {}
