import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exitCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (exitCategory) {
      throw new HttpException('分类已经存在', HttpStatus.BAD_REQUEST);
    }
    return await this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const exitCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!exitCategory) {
      throw new HttpException('分类不存在', HttpStatus.BAD_REQUEST);
    }
    return exitCategory;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const findCategory = await this.findOne(id);
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const findCategory = await this.findOne(id);
    // 还要删除parent_id为id的分类
    await this.categoryRepository.delete({
      parent_id: id,
    });
    return await this.categoryRepository.delete(id);
  }
}
