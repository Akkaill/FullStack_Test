import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Student } from './modules/students/students.entity';
import { Room } from './modules/rooms/rooms.entity';
import { RoomMembership } from './modules/membership/membership.entity';
import { Init1710000000000 } from './database/migrations/1710000000000-init';
import { AddAcademicYearToRooms1710000000001 } from './database/migrations/1710000000000-add-academic';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Student, Room, RoomMembership],
  migrations: [Init1710000000000, AddAcademicYearToRooms1710000000001],
  logging: true,
});
