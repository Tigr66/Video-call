#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1eefabdf1dc6a4a344a0e599efdbcaec40f333a0ff11ffe84ad2ebbc6fdcd150/contract';
import endContract from '../../snapshots/1eefabdf1dc6a4a344a0e599efdbcaec40f333a0ff11ffe84ad2ebbc6fdcd150/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'room',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'room',
        constraint: 'room_code_key',
        columns: ['code'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
