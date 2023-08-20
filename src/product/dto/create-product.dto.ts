import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: '商品名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '商品价格不能为空' })
  @IsNumber()
  price: number;

  productImgs: string[];
}
