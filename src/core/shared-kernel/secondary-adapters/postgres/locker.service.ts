import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LockerService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async lock(id: number): Promise<boolean> {
    const lock = await this.dataSource.query('SELECT pg_try_advisory_lock($1) as lock', [id]);
    return lock[0].lock;
  }

  public async unlock(id: number): Promise<boolean> {
    await this.dataSource.query('SELECT pg_advisory_unlock($1) as lock', [id]);
    return true;
  }
}
