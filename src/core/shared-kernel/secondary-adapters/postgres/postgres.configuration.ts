import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { config } from 'dotenv';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { getEnvOrDefault } from '../../common/utils/get-env-or-default';
import ClearNamingStrategy from './clear-naming.strategy';

config();

const generateConnectionConfig = (): TypeOrmModuleOptions => {
  const dbConfig = {
    type: 'postgres',
    host: getEnvOrDefault('POSTGRES_HOST', 'localhost'),
    port: getEnvOrDefault('POSTGRES_PORT', 5432),
    username: getEnvOrDefault('POSTGRES_USER', 'admin'),
    password: getEnvOrDefault('POSTGRES_PASSWORD', 'admin'),
    database: getEnvOrDefault('POSTGRES_DATABASE', 'template'),
  };
  return {
    ...(dbConfig as PostgresConnectionOptions),
    cache: {
      duration: getEnvOrDefault('ORM_CACHE_DURATION', 60_000),
    },
    synchronize: false,
    logging: ['development', 'local'].includes(getEnvOrDefault('NODE_ENV', 'development')),
    entities: [join(__dirname, '../../../', 'components/**/secondary-adapters/postgres/data/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../../../../migrations/*{.ts,.js}')],
    subscribers: [join(__dirname, '../../../components/**/secondary-adapters/postgres/subscribers/*{.ts,.js}')],
    // migrationsRun: true,
    namingStrategy: new ClearNamingStrategy(),
    poolSize: process.env.NODE_ENV === 'prod' ? 200 : 20,
  };
};

export default generateConnectionConfig();
