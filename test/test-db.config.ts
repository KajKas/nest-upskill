import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Supplier } from '../src/infrastructure/supplier/supplier.entity';
import { Manager } from '../src/infrastructure/manager/manager.entity';

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test_db',
  entities: [Supplier, Manager],
  synchronize: true,
  dropSchema: true,
  logging: true,
  extra: {
    connectionLimit: 1,
  },
};
