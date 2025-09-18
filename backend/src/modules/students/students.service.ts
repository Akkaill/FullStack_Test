import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './students.entity';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}

  async list(q: any) {
    const { search, by, level, gender, page = 1, limit = 10 } = q;
    const qb = this.repo.createQueryBuilder('s');

    if (level) {
      const lvRaw = String(level).trim();
      const lvNum = lvRaw.replace(/\D/g, '');
      if (lvNum) {
        qb.andWhere(
          '(s.level = :lv OR s.level LIKE :lvLike OR s.level LIKE :lvNumLike)',
          {
            lv: lvRaw,
            lvLike: `%${lvRaw}%`,
            lvNumLike: `%${lvNum}%`,
          },
        );
      } else {
        qb.andWhere('(s.level = :lv OR s.level LIKE :lvLike)', {
          lv: lvRaw,
          lvLike: `%${lvRaw}%`,
        });
      }
    }
    if (gender) qb.andWhere('s.gender = :gender', { gender });

    if (search) {
      if (by === 'code')
        qb.andWhere('s.studentCode LIKE :kw', { kw: `%${search}%` });
      else if (by === 'name')
        qb.andWhere('(s.firstName LIKE :kw OR s.lastName LIKE :kw)', {
          kw: `%${search}%`,
        });
      else if (by === 'nickname')
        qb.andWhere('s.nickName LIKE :kw', { kw: `%${search}%` });
      else
        qb.andWhere(
          '(s.studentCode LIKE :kw OR s.firstName LIKE :kw OR s.lastName LIKE :kw OR s.nickName LIKE :kw)',
          { kw: `%${search}%` },
        );
    }

    qb.orderBy('s.id', 'DESC')
      .skip((page - 1) * limit)
      .take(+limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: +page, limit: +limit };
  }

  create(dto: any) {
    const data = this.repo.create({
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
    });
    return this.repo.save(data);
  }
  get(id: number) {
    return this.repo.findOneByOrFail({ id });
  }
  async update(id: number, dto: any) {
    await this.repo.update(id, {
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
    });
    return this.get(id);
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
}
