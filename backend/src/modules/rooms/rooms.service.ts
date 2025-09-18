import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms.entity';
import { UpdateRoomDto, CreateRoomDto } from './rooms.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private repo: Repository<Room>) {}

  async list(q: any) {
    const { search, by, level, academicYear, page = 1, limit = 10 } = q;
    const qb = this.repo.createQueryBuilder('r');
    if (level) {
      const lvRaw = String(level).trim();
      const lvNum = lvRaw.replace(/\D/g, '');
      if (lvNum) {
        qb.andWhere(
          '(r.level = :lv OR r.level LIKE :lvLike OR r.level LIKE :lvNumLike)',
          {
            lv: lvRaw,
            lvLike: `%${lvRaw}%`,
            lvNumLike: `%${lvNum}%`,
          },
        );
      } else {
        qb.andWhere('(r.level = :lv OR r.level LIKE :lvLike)', {
          lv: lvRaw,
          lvLike: `%${lvRaw}%`,
        });
      }
    }
    if (academicYear)
      qb.andWhere('r.academicYear LIKE :yr', {
        yr: `%${String(academicYear).trim()}%`,
      });
    if (search) {
      if (by === 'code')
        qb.andWhere('r.roomCode LIKE :kw', { kw: `%${search}%` });
      else if (by === 'name')
        qb.andWhere('r.roomName LIKE :kw', { kw: `%${search}%` });
      else if (by === 'teacher')
        qb.andWhere('r.homeroomTeacher LIKE :kw', { kw: `%${search}%` });
      else
        qb.andWhere(
          '(r.roomCode LIKE :kw OR r.roomName LIKE :kw OR r.homeroomTeacher LIKE :kw)',
          { kw: `%${search}%` },
        );
    }
    qb.orderBy('r.id', 'DESC')
      .skip((page - 1) * limit)
      .take(+limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: +page, limit: +limit };
  }
  create(dto: CreateRoomDto) {
    return this.repo.save(this.repo.create(dto));
  }
  get(id: number) {
    return this.repo.findOneByOrFail({ id });
  }
  async update(id: number, dto: UpdateRoomDto) {
    await this.repo.update({ id }, dto);
    return this.repo.findOneByOrFail({ id });
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
}
