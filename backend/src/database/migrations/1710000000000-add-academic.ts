import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcademicYearToRooms1710000000001 implements MigrationInterface {
  name = 'AddAcademicYearToRooms1710000000001';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      ALTER TABLE rooms
      ADD COLUMN academic_year VARCHAR(10) NULL AFTER level;
    `);

    await q.query(
      `UPDATE rooms SET academic_year = '2025' WHERE academic_year IS NULL;`,
    );
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE rooms DROP COLUMN academic_year;`);
  }
}
