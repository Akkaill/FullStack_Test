import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateRoomDto {
  @IsString() @IsNotEmpty() roomCode!: string;
  @IsString() @IsNotEmpty() roomName!: string;
  @IsString() @IsNotEmpty() level!: string;
  @IsOptional() @IsString() academicYear?: string;
  @IsOptional() @IsString() homeroomTeacher?: string;
}
export class UpdateRoomDto extends CreateRoomDto {}
