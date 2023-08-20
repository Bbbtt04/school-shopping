import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImg } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImg)
    private readonly productImgRepository: Repository<ProductImg>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { productImgs, name } = createProductDto;
    const exitProduct = await this.productRepository.findOne({
      where: { name },
    });
    if (exitProduct) {
      throw new HttpException('商品已存在', HttpStatus.BAD_REQUEST);
    }
    const newProduct = await this.productRepository.create(createProductDto);
    // 保存商品图片
    if (productImgs && productImgs.length > 0) {
      console.log('productImgs', productImgs);

      productImgs.forEach(async (img) => {
        const newProductImg = await this.productImgRepository.create({
          url: img,
          productId: newProduct,
        });
        await this.productImgRepository.save(newProductImg);
      });
    }
    return this.productRepository.save(newProduct);
  }

  findAll() {
    // 还要查询商品图片
    return this.productRepository.find({
      relations: ['imgs'],
    });
  }

  findOne(id: number) {
    const exitProduct = this.productRepository.findOne({
      where: { id },
    });
    if (!exitProduct) {
      throw new HttpException('商品不存在', HttpStatus.BAD_REQUEST);
    }
    return exitProduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const exitProduct = await this.findOne(id);

    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    const exitProduct = await this.findOne(id);

    return this.productRepository.delete(id);
  }
}
