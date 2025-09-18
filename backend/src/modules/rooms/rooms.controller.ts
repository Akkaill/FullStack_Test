import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly svc: RoomsService) {}
  @Get() list(@Query() q: any) {
    return this.svc.list(q);
  }
  @Post() create(@Body() dto: CreateRoomDto) {
    return this.svc.create(dto);
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.svc.get(+id);
  }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.svc.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
