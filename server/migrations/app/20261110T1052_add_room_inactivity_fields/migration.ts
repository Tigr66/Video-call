#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1eefabdf1dc6a4a344a0e599efdbcaec40f333a0ff11ffe84ad2ebbc6fdcd150/contract';
import startContract from '../../snapshots/1eefabdf1dc6a4a344a0e599efdbcaec40f333a0ff11ffe84ad2ebbc6fdcd150/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/81a30e2e7c232bb81a31f00c1de66eda6279ca58dfbca818b521de459789baac/contract';
import endContract from '../../snapshots/81a30e2e7c232bb81a31f00c1de66eda6279ca58dfbca818b521de459789baac/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'room',
        column: col('inactiveAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'room',
        column: col('isActive', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
