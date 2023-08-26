import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SearchProductDto {
  @IsNumber()
  categoryId: number;
}
