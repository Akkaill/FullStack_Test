import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString() @IsNotEmpty() studentCode!: string;
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsOptional() @IsString() nickName?: string;
  @IsOptional() @IsEnum(['M','F','O'] as any) gender?: 'M'|'F'|'O';
  @IsOptional() @IsDateString() birthDate?: string;
  @IsString() @IsNotEmpty() level!: string;
}
export class UpdateStudentDto extends CreateStudentDto {}
