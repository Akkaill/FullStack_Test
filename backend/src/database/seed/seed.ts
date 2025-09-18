import ds from '../../typeorm-datasource';
import { Student } from '../../modules/students/students.entity';
import { Room } from '../../modules/rooms/rooms.entity';

async function main() {
  const dataSource = await ds.initialize();
  const sRepo = dataSource.getRepository(Student);
  const rRepo = dataSource.getRepository(Room);

  await rRepo.save([
    rRepo.create({
      roomCode: 'M1-A',
      roomName: 'ม.1/1',
      level: 'ม.1',
      academicYear: '2025',
      homeroomTeacher: 'ครูเอ',
    }),
    rRepo.create({
      roomCode: 'M1-B',
      roomName: 'ม.1/2',
      level: 'ม.1',
      academicYear: '2025',
      homeroomTeacher: 'ครูบี',
    }),
    rRepo.create({
      roomCode: 'M2-A',
      roomName: 'ม.2/1',
      level: 'ม.2',
      academicYear: '2025',
      homeroomTeacher: 'ครูซี',
    }),
  ]);

  await sRepo.save(
    Array.from({ length: 12 }).map((_, i) =>
      sRepo.create({
        studentCode: `S${1000 + i}`,
        firstName: `Name${i}`,
        lastName: `Last${i}`,
        nickName: `N${i}`,
        gender: i % 2 === 0 ? 'M' : 'F',
        level: i < 6 ? 'ม.1' : 'ม.2',
      }),
    ),
  );

  await dataSource.destroy();
  console.log('Seed done');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
