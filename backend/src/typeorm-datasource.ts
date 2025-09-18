import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { Student } from './modules/students/students.entity';
import { Room } from './modules/rooms/rooms.entity';
import { RoomMembership } from './modules/membership/membership.entity';

const isTs = __filename.endsWith('.ts');

const migrationsGlob = isTs
  ? path.join(__dirname, 'database', 'migrations', '*.ts')  
  : path.join(__dirname, 'database', 'migrations', '*.js'); 

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Student, Room, RoomMembership],
  migrations: [migrationsGlob],
  logging: true, 
 
});
