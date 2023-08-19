import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { enPassword } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { phone, password } = createUserDto;
    try {
      const hashPassword = enPassword(password);
      createUserDto.password = hashPassword;

      const isCreated = await this.userRepository.findOne({
        where: { phone: phone, is_del: false },
      });

      if (isCreated) {
        return '手机号已存在';
      }
      const newUser = await this.userRepository.create(createUserDto);
      return this.userRepository.save(newUser);
    } catch (error) {
      // 处理错误情况
      console.error('Error:', error);
      return '创建用户失败';
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id, is_del: false },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 更新用户信息
    const exitUser = await this.userRepository.findOne({
      where: { id: id, is_del: false },
    });
    if (!exitUser) {
      return '用户不存在';
    }
    const updateUser = await this.userRepository.merge(exitUser, updateUserDto);
    return this.userRepository.save(updateUser);
  }

  async remove(id: number) {
    return await this.update(id, { is_del: true });
  }
}
