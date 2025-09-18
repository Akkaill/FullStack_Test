import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { RoomMembership } from './membership.entity';
import { Room } from '../rooms/rooms.entity';

@Injectable()
export class MembershipsService {
  constructor(
    private ds: DataSource,
    @InjectRepository(RoomMembership) private rmRepo: Repository<RoomMembership>,
    @InjectRepository(Room) private roomRepo: Repository<Room>,
  ) {}

  listMembers(roomId:number){
    return this.rmRepo.find({ where:{ roomId, leftAt: IsNull() }, relations:['student'] });
  }

  async addMember(roomId:number, studentId:number){
    const room = await this.roomRepo.findOneBy({ id: roomId });
    if (!room) throw new NotFoundException('room not found');

    return this.ds.transaction(async trx => {
      // active ในระดับเดียวกัน?
      const active = await trx.getRepository(RoomMembership)
        .createQueryBuilder('rm')
        .innerJoin(Room,'r','r.id = rm.roomId')
        .where('rm.studentId = :sid AND rm.leftAt IS NULL AND r.level = :lvl',
               { sid: studentId, lvl: room.level })
        .getOne();

      if (active) {
        if (active.roomId === roomId) throw new ConflictException('already in this room');
        await trx.getRepository(RoomMembership).update(active.id, { leftAt: () => 'NOW()' });
      }
      const entity = trx.getRepository(RoomMembership).create({ roomId, studentId, leftAt: null });
      return trx.getRepository(RoomMembership).save(entity);
    });
  }

  async leave(memberId:number){
    const mem = await this.rmRepo.findOneBy({ id: memberId });
    if (!mem || mem.leftAt) throw new NotFoundException('member not active');
    return this.rmRepo.update(memberId, { leftAt: () => 'NOW()' });
  }
}
