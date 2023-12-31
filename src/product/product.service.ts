import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImg, ProductImgType } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchProductDto } from './dto/search-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImg)
    private readonly productImgRepository: Repository<ProductImg>,
  ) {}

  // async create(createProductDto: CreateProductDto) {
  //   const id2Product = await this.productRepository.findOne({
  //     where: { id: 1 },
  //   });
  //   // 测试图片
  //   const newProductImg = await this.productImgRepository.create({
  //     product: id2Product,
  //     url: 'https://p6-passport.byteacctimg.com/img/user-avatar/fc18c0317d8a855edee0581de1dbb091~90x90.awebp',
  //     type: ProductImgType.thumbnail,
  //   });
  //   return await this.productImgRepository.save(newProductImg);
  // }

  async create(createProductDto: CreateProductDto) {
    const { productImgs, name, categoryId } = createProductDto;
    const exitProduct = await this.productRepository.findOne({
      where: { name },
    });
    if (exitProduct) {
      throw new HttpException('商品已存在', HttpStatus.BAD_REQUEST);
    }
    const newProduct = await this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      description: createProductDto.description,
    });
    await this.productRepository.save(newProduct);
    // 保存商品图片
    if (productImgs) {
      const { thumbnail, detail } = productImgs;
      if (thumbnail && thumbnail.length > 0) {
        thumbnail.forEach(async (img) => {
          const newProductImg = await this.productImgRepository.create({
            url: img,
            product: newProduct,
            type: ProductImgType.thumbnail,
          });
          await this.productImgRepository.save(newProductImg);
        });
      }
      if (detail && detail.length > 0) {
        detail.forEach(async (img) => {
          const newProductImg = await this.productImgRepository.create({
            url: img,
            product: newProduct,
            type: ProductImgType.detail,
          });
          await this.productImgRepository.save(newProductImg);
        });
      }
    }
    // 分类
    if (categoryId) {
      await this.productRepository
        .createQueryBuilder()
        .relation(Product, 'category')
        .of(newProduct)
        .set(categoryId);
    }

    const res = await this.productRepository.findOne({
      where: { id: newProduct.id },
      relations: ['product_imgs', 'category'],
    });
    return this.formatProductRes([res]);
  }

  async findAll(searchProductDto: SearchProductDto) {
    console.log(searchProductDto);
    const { categoryId } = searchProductDto;

    const query = this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.product_imgs', 'product_imgs')
      .leftJoinAndSelect('p.category', 'category');

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    // 还要查询商品图片
    const products = await query.getMany();

    return this.formatProductRes(products);
  }

  async findOne(id: number) {
    const exitProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['product_imgs'],
    });
    if (!exitProduct) {
      throw new HttpException('商品不存在', HttpStatus.BAD_REQUEST);
    }
    return this.formatProductRes([exitProduct]);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const exitProduct = await this.findOne(id);

    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    const exitProduct = await this.findOne(id);

    return this.productRepository.delete(id);
  }

  formatProductRes(products: Product[]) {
    return products.map((item) => {
      const product_imgs = item.product_imgs;

      const thumbnail = product_imgs
        .filter((img) => img.type === ProductImgType.thumbnail)
        .map((img) => img.url);
      const detail = product_imgs
        .filter((img) => img.type === ProductImgType.detail)
        .map((img) => img.url);
      return {
        ...item,
        product_imgs: {
          thumbnail,
          detail,
        },
      };
    });
  }
}
