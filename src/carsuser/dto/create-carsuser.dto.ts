import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CarType {
  SALE = 'Sale',
  RENT = 'Rent',
}

// 👤 بيانات المالك
export class OwnerAddressDto {
  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class CreateCarsuserDto {
  // الصور (واجب)
  @IsArray()
  @IsString({ each: true })
  images: string[];

  // بيانات العربية
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsEnum(CarType)
  type: CarType;

  @IsString()
  @IsOptional()
  operationType?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  addedDate?: Date;

  @IsString()
  @IsOptional()
  factoryCondition?: string;

  @IsNumber()
  @IsOptional()
  doors?: number;

  @IsString()
  @IsOptional()
  modification?: string;

  @IsNumber()
  @IsOptional()
  horsepower?: number;

  @IsNumber()
  @IsOptional()
  engineCapacity?: number;

  @IsString()
  @IsOptional()
  fuelType?: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @IsNumber()
  @IsOptional()
  year?: number;
@IsNumber()
  @IsOptional()
kilometers?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  // بيانات المالك (حقيقية)
  @IsString()
  ownerName: string;

  @IsString()
  ownerPhone: string;

  @IsOptional()
  @IsString()
  ownerEmail?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerAddressDto)
  ownerAddress?: OwnerAddressDto;
}