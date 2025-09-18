import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './students.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly svc: StudentsService) {}
  @Get() list(@Query() q:any){ return this.svc.list(q); }
  @Post() create(@Body() dto:CreateStudentDto){ return this.svc.create(dto); }
  @Get(':id') get(@Param('id') id:string){ return this.svc.get(+id); }
  @Patch(':id') update(@Param('id') id:string,@Body() dto:UpdateStudentDto){ return this.svc.update(+id,dto); }
  @Delete(':id') remove(@Param('id') id:string){ return this.svc.remove(+id); }
}
