import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: '商品名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '商品价格不能为空' })
  @IsNumber()
  price: number;

  productImgs: {
    thumbnail: string[];
    detail: string[];
  };

  @IsNotEmpty({ message: '商品描述不能为空' })
  @IsString()
  description: string;

  categoryId: number;
}
