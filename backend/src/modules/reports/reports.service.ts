import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(private ds: DataSource) {}

  private readSqlFile(filename: string) {
    const candidates = [
      path.join(__dirname, 'sql', filename),

      path.join(process.cwd(), 'dist', 'modules', 'reports', 'sql', filename),

      path.join(process.cwd(), 'src', 'modules', 'reports', 'sql', filename),
    ];

    for (const p of candidates) {
      if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8');
    }
    throw new Error(`SQL file not found. Looked at:\n${candidates.join('\n')}`);
  }

  async summary() {
    try {
      const sql = this.readSqlFile('summary.sql');
      return await this.ds.query(sql);
    } catch (e) {
      console.error('[REPORTS] summary error:', e);
      throw e;
    }
  }
}
