import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students')
@Index(['level'])
@Index(['gender'])
export class Student {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'student_code', unique: true })
  studentCode: string;

  @Column({ name: 'first_name' }) firstName: string;
  @Column({ name: 'last_name' }) lastName: string;

  @Column({ name: 'nick_name', nullable: true }) nickName?: string;

  @Column({ type: 'enum', enum: ['M','F','O'], default: 'O' })
  gender: 'M'|'F'|'O';

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date | null;

  @Column() level: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
