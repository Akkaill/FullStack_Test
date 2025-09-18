import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { MembershipsService } from './membership.service';

@Controller('rooms/:roomId/members')
export class MembershipsController {
  constructor(private readonly svc: MembershipsService) {}

  @Get()
  list(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.svc.listMembers(roomId);
  }

  @Post()
  add(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body('studentId', ParseIntPipe) studentId: number, // ⬅️ บังคับเป็น number
  ) {
    return this.svc.addMember(roomId, studentId);
  }

  @Patch(':memberId/leave')
  leave(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.svc.leave(memberId);
  }
}
