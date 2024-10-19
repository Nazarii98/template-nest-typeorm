import { DataSource, DataSourceOptions } from 'typeorm';
import postgresConfiguration from '@shared-kernel/secondary-adapters/postgres/postgres.configuration';

export default new DataSource(postgresConfiguration as DataSourceOptions);
