import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

@IsNumber()
  @IsOptional()
kilometers?: number;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  type?: string;

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

  @IsString()
  @IsOptional()
  color?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}