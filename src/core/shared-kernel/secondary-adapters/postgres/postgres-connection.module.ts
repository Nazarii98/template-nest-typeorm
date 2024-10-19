import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockerService } from '@shared-kernel/secondary-adapters/postgres/locker.service';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import postgresConfiguration from './postgres.configuration';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => postgresConfiguration,

      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
  providers: [LockerService],
  exports: [TypeOrmModule, LockerService],
})
export default class PostgresConnectionModule {}
