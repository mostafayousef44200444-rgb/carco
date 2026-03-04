import { IsNotEmpty, IsEnum, IsNumber, Min, IsOptional, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  productId: string;

  @IsEnum(['Car', 'Caruser'])
  productModel: 'Car' | 'Caruser';

  @IsEnum(['Sale', 'Rent'])
  orderType: 'Sale' | 'Rent';

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  rentStart?: Date;

  @IsOptional()
  rentEnd?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment?: PaymentDto;
}