import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './configuration';

const { type, database, host, password, port, username } =
  configuration.typeorm.db;
export const typeormConifg: TypeOrmModuleOptions = {
  type: type as 'mysql',
  database,
  host,
  password,
  port,
  username,
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
  autoLoadEntities: true, // 自动加载实体
};
