import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;

  /**
   * 关联分类
   */
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  /**
   * 图片
   */
  @OneToMany(() => ProductImg, (productImg) => productImg.productId)
  imgs: ProductImg[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
/**
 * 货物图片
 */
export enum ProductImgType {
  /**
   * 缩略图
   */
  thumbnail = 'thumbnail',
  /**
   * 详情图
   */
  detail = 'detail',
}

@Entity('product_img')
export class ProductImg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ProductImgType,
    default: ProductImgType.thumbnail,
  })
  type: ProductImgType;

  @ManyToOne(() => Product, (product) => product.imgs)
  productId: Product;
}
