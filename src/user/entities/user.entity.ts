import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 角色权限：管理员、普通用户、配送员
 */
export enum Role {
  ADMIN = 'admin',
  User = 'user',
  Deliverer = 'deliverer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
    nullable: true,
    comment: '角色权限：管理员、普通用户、配送员',
  })
  role: Role;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '0:正常 1:禁言 2:封禁',
    nullable: true,
  })
  status: number;

  @Column({
    type: 'tinyint',
    default: false,
    comment: '软删除',
    nullable: true,
  })
  is_del: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
