import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../students/students.entity';
import { Room } from '../rooms/rooms.entity';

@Entity('room_members')
@Index(['studentId','leftAt'])
export class RoomMembership {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'student_id' }) studentId: number;
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' }) student: Student;

  @Column({ name: 'room_id' }) roomId: number;
  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' }) room: Room;

  @CreateDateColumn({ name: 'joined_at' }) joinedAt: Date;
  @Column({ name: 'left_at', type: 'datetime', nullable: true }) leftAt: Date | null;
}
