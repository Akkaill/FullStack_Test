import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
@Index(['level'])
export class Room {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'room_code', unique: true }) roomCode: string;
  @Column({ name: 'room_name' }) roomName: string;
  @Column() level: string;
  @Column({ name: 'academic_year', nullable: true })
  academicYear?: string;
  @Column({ name: 'homeroom_teacher', nullable: true })
  homeroomTeacher?: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
