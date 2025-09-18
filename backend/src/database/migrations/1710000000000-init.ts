import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1710000000000 implements MigrationInterface {
  name = 'Init1710000000000';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_code VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name  VARCHAR(255) NOT NULL,
        nick_name  VARCHAR(255) NULL,
        gender ENUM('M','F','O') NOT NULL DEFAULT 'O',
        birth_date DATE NULL,
        level VARCHAR(100) NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX idx_students_level (level),
        INDEX idx_students_gender (gender)
      ) ENGINE=InnoDB;
    `);
    await q.query(`
      CREATE TABLE rooms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        room_code VARCHAR(255) UNIQUE NOT NULL,
        room_name VARCHAR(255) NOT NULL,
        level VARCHAR(100) NOT NULL,
        homeroom_teacher VARCHAR(255) NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX idx_rooms_level (level)
      ) ENGINE=InnoDB;
    `);
    await q.query(`
      CREATE TABLE room_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        room_id INT NOT NULL,
        joined_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        left_at DATETIME NULL,
        INDEX idx_rm_student_left (student_id, left_at),
        CONSTRAINT fk_rm_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        CONSTRAINT fk_rm_room    FOREIGN KEY (room_id)    REFERENCES rooms(id)    ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE room_members`);
    await q.query(`DROP TABLE rooms`);
    await q.query(`DROP TABLE students`);
  }
}
