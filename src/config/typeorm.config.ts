import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port:
    typeof process.env.DB_PORT === 'string'
      ? parseInt(process.env.DB_PORT, 10)
      : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'banking',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
